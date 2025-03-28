// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract FractalGovernance is Ownable, AccessControl {
    bytes32 public constant DAO_CREATOR_ROLE = keccak256("DAO_CREATOR_ROLE");
    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");

    struct DAO {
        uint256 id;
        address creator;
        address[] childDAOs;
        mapping(address => uint256) votes;
        uint256 totalVotes;
        bool decisionMade;
        bool decisionOutcome; // true for approval, false for rejection
    }

    mapping(uint256 => DAO) public daos;
    uint256 public daoCount;

    event DaoCreated(uint256 indexed daoId, address indexed creator);
    event ChildDaoAdded(uint256 indexed parentDaoId, address indexed childDao);
    event Voted(uint256 indexed daoId, address indexed voter, uint256 votes);
    event DecisionMade(uint256 indexed daoId, bool outcome);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(DAO_CREATOR_ROLE, msg.sender);
    }

    modifier onlyDaoCreator() {
        require(hasRole(DAO_CREATOR_ROLE, msg.sender), "Caller is not a DAO creator");
        _;
    }

    modifier onlyVoter() {
        require(hasRole(VOTER_ROLE, msg.sender), "Caller is not a voter");
        _;
    }

    function createDao() external onlyDaoCreator {
        uint256 newDaoId = daoCount++;
        DAO storage newDao = daos[newDaoId];
        newDao.id = newDaoId;
        newDao.creator = msg.sender;
        newDao.decisionMade = false;

        emit DaoCreated(newDaoId, msg.sender);
    }

    function addChildDao(uint256 parentDaoId, address childDao) external onlyDaoCreator {
        require(daos[parentDaoId].id == parentDaoId, "Parent DAO does not exist");
        daos[parentDaoId].childDAOs.push(childDao);

        emit ChildDaoAdded(parentDaoId, childDao);
    }

    function vote(uint256 daoId, uint256 voteCount) external onlyVoter {
        require(!daos[daoId].decisionMade, "Decision already made");
        require(voteCount > 0, "Vote count must be greater than 0");

        daos[daoId].votes[msg.sender] += voteCount;
        daos[daoId].totalVotes += voteCount;

        emit Voted(daoId, msg.sender, voteCount);
    }

    function makeDecision(uint256 daoId) external onlyDaoCreator {
        require(!daos[daoId].decisionMade, "Decision already made");

        uint256 totalVotes = daos[daoId].totalVotes;
        require(totalVotes > 0, "No votes cast");

        // Simple majority decision
        daos[daoId].decisionOutcome = (totalVotes / 2) < daos[daoId].totalVotes;
        daos[daoId].decisionMade = true;

        emit DecisionMade(daoId, daos[daoId].decisionOutcome);
    }

    function getDaoInfo(uint256 daoId) external view returns (uint256, address, address[] memory, uint256, bool, bool) {
        DAO storage dao = daos[daoId];
        return (dao.id, dao.creator, dao.childDAOs, dao.totalVotes, dao.decisionMade, dao.decisionOutcome);
    }
}
