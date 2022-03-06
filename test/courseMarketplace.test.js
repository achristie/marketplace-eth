const { catchRevert } = require("./utils/exceptions");
const CourseMarketplace = artifacts.require("CourseMarketplace");

const getGas = async (result) => {
  const tx = await web3.eth.getTransaction(result.tx);
  const gasUsed = web3.utils.toBN(result.receipt.gasUsed);
  const gasPrice = web3.utils.toBN(tx.gasPrice);
  const gas = gasUsed.mul(gasPrice);

  return gas;
};

contract("CourseMarketplace", (accounts) => {
  const courseId = "0x00000000000000000000000000003130";
  const proof =
    "0x0000000000000000000000000000313000000000000000000000000000003130";
  const courseId2 = "0x00000000000000000000000000003131";
  const proof2 =
    "0x0000000000000000000000000000313000000000000000000000000000003133";
  const value = "900000000";

  let _contract = null;
  let contractOwner = null;
  let buyer = null;
  let courseHash = null;

  before(async () => {
    _contract = await CourseMarketplace.deployed();
    contractOwner = accounts[0];
    buyer = accounts[1];
  });

  describe("Purchase the new course", () => {
    before(async () => {
      await _contract.purchaseCourse(courseId, proof, {
        from: buyer,
        value,
      });
    });

    it("should not allow double purchase", async () => {
      await catchRevert(
        _contract.purchaseCourse(courseId, proof, { from: buyer, value })
      );
    });

    it("can get the purchased course hash by index", async () => {
      const index = 0;
      courseHash = await _contract.getCourseHashAtIndex(index);
      const expectedHash = web3.utils.soliditySha3(
        { type: "bytes16", value: courseId },
        { type: "address", value: buyer }
      );

      assert.equal(courseHash, expectedHash, "Course hash does not match");
    });

    it("should match the purchased data of the course", async () => {
      const expectedIndex = 0;
      const expectedState = 0;
      const course = await _contract.getCourseByHash(courseHash);

      assert.equal(course.id, expectedIndex, "Indexes should match");
      assert.equal(course.price, value, "Values should match");
      assert.equal(course.proof, proof, "Proof should match");
      assert.equal(course.state, expectedState, "State should match");
      assert.equal(course.owner, buyer, "Owner should match");
    });
  });

  describe("Activate the purchased course", () => {
    it("non owner shouldnt be able to activate course", async () => {
      catchRevert(_contract.activateCourse(courseHash, { from: buyer }));
    });

    it("should have an activate status", async () => {
      await _contract.activateCourse(courseHash, { from: contractOwner });
      const course = await _contract.getCourseByHash(courseHash);
      const expectedState = 1;

      assert.equal(
        course.state,
        expectedState,
        "Course should be in activated state"
      );
    });
  });
  describe("Transfer ownership", () => {
    let currentOwner = null;
    before(async () => {
      currentOwner = await _contract.getContractOwner();
    });
    it("non owner shouldnt be able to activate course", async () => {
      assert.equal(
        contractOwner,
        currentOwner,
        "Contract owner does not match"
      );
    });
    it("should not transfer ownership unless instructed by owner", async () => {
      await catchRevert(
        _contract.transferOwnership(accounts[3], { from: accounts[4] })
      );
    });
    it("should transfer ownership if owner asks", async () => {
      await _contract.transferOwnership(accounts[2], { from: currentOwner });
      const owner = await _contract.getContractOwner();
      assert.equal(owner, accounts[2], "New owner is not correct");
    });
  });

  describe("Deactivate course", () => {
    let courseHash2 = null;
    before(async () => {
      await _contract.purchaseCourse(courseId2, proof2, { from: buyer, value });
      courseHash2 = await _contract.getCourseHashAtIndex(1);
    });

    it("should not be able to deactivate course except by owner", async () => {
      await catchRevert(
        _contract.deactivateCourse(courseHash2, { from: buyer })
      );
    });
    it("should have status of deactivated and price 0", async () => {
      await _contract.deactivateCourse(courseHash2, { from: contractOwner });
      const course = await _contract.getCourseByHash(courseHash2);
      const exptectedState = 2;
      const exptectedPrice = 0;

      assert.equal(course.state, exptectedState, "Course is NOT deactivated!");
      assert.equal(course.price, exptectedPrice, "Course price is not 0!");
    });

    it("should not be able to activate deactivated course", async () => {
      await catchRevert(
        _contract.activateCourse(courseHash2, { from: contractOwner })
      );
    });
  });

  describe("Repurchase course", () => {
    let courseHash2 = null;

    before(async () => {
      courseHash2 = await _contract.getCourseHashAtIndex(1);
    });

    it("should not repurchase when the course does not exist", async () => {
      const notExistingHash =
        "0xf7808447963078c7d10a484a68992c94e7797d42e111b44f2b5207c9ca0b140e";

      await catchRevert(
        _contract.repurchaseCourse(notExistingHash, { from: buyer })
      );
    });
    it("can only repurchase if owner", async () => {
      const notOwner = accounts[2];

      await catchRevert(
        _contract.repurchaseCourse(courseHash2, { from: notOwner })
      );
    });
    it("should not be able to repurchase purchsed course", async () => {
      await catchRevert(
        _contract.repurchaseCourse(courseHash2, { from: buyer })
      );
    });
    it("should be able to repurchase with original buyer", async () => {
      const beforeTxBuyerBalance = await web3.eth.getBalance(buyer);
      const beforeTxContractBalance = await web3.eth.getBalance(
        _contract.address
      );
      const result = await _contract.repurchaseCourse(courseHash2, {
        from: buyer,
        value,
      });
      const gas = await getGas(result);
      const afterTxBuyerBalance = await web3.eth.getBalance(buyer);
      const afterTxContractBalance = await web3.eth.getBalance(
        _contract.address
      );

      const course = await _contract.getCourseByHash(courseHash2);
      const expectedState = 0;

      assert.equal(
        course.state,
        expectedState,
        "The course is not in purchased state"
      );
      assert.equal(
        course.price,
        value,
        "Course price is not equal to the value"
      );

      assert.equal(
        web3.utils
          .toBN(beforeTxBuyerBalance)
          .sub(web3.utils.toBN(value))
          .sub(gas)
          .toString(),
        afterTxBuyerBalance,
        "Client balance is not correct"
      );
      assert.equal(
        web3.utils
          .toBN(beforeTxContractBalance)
          .add(web3.utils.toBN(value))
          .toString(),
        afterTxContractBalance,
        "Contract balance is not correct"
      );
    });
  });

  describe("Receive funds", () => {
    it("should have funds", async () => {
      const value = "10000000000000000";
      const contractBeforeTx = await web3.eth.getBalance(_contract.address);
      await web3.eth.sendTransaction({
        from: buyer,
        to: _contract.address,
        value,
      });

      const contractAfterTx = await web3.eth.getBalance(_contract.address);

      assert.equal(
        web3.utils
          .toBN(contractBeforeTx)
          .add(web3.utils.toBN(value))
          .toString(),
        contractAfterTx,
        "Values do not match"
      );
    });
  });
});
