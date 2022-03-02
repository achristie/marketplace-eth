const { catchRevert } = require("./utils/exceptions");
const CourseMarketplace = artifacts.require("CourseMarketplace");

contract("CourseMarketplace", (accounts) => {
  const courseId = "0x00000000000000000000000000003130";
  const proof =
    "0x0000000000000000000000000000313000000000000000000000000000003130";
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
});
