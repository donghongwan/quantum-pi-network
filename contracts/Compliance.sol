// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Compliance {
    struct ComplianceStatus {
        bool isCompliant;
        uint256 expirationDate;
    }

    mapping(address => ComplianceStatus) private compliantUsers;

    event ComplianceChecked(address indexed user, bool isCompliant, uint256 expirationDate);
    event ComplianceUpdated(address indexed user, bool isCompliant, uint256 expirationDate);

    function checkCompliance(address _user) public {
        ComplianceStatus memory status = compliantUsers[_user];
        emit ComplianceChecked(_user, status.isCompliant, status.expirationDate);
    }

    function setCompliance(address _user, bool _isCompliant, uint256 _durationInDays) public {
        uint256 expirationDate = block.timestamp + (_durationInDays * 1 days);
        compliantUsers[_user] = ComplianceStatus({
            isCompliant: _isCompliant,
            expirationDate: expirationDate
        });
        emit ComplianceUpdated(_user, _isCompliant, expirationDate);
    }

    function revokeCompliance(address _user) public {
        delete compliantUsers[_user];
        emit ComplianceUpdated(_user, false, 0);
    }

    function isUser Compliant(address _user) public view returns (bool) {
        ComplianceStatus memory status = compliantUsers[_user];
        return status.isCompliant && (block.timestamp < status.expirationDate);
    }
}
