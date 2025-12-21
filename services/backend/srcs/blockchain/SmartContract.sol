// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MatchStorage
 * @notice A contract to store and manage match records between players.
 * @dev Matches are immutable after recording, but administrative logic can be updated.
 */
contract MatchStorage {

    /// @notice The address with administrative privileges.
    address public _owner;

    /// @notice Flag indicating whether the contract is paused.
    bool public _paused;

    /// @notice Maximum number of matches allowed per player.
    uint256 private _maxMatchesPerPlayer = 1000;

    /// @notice Maximum total number of matches allowed in the contract.
    uint256 private _maxTotalMatches = 10000;

    /// @notice Counter for the total number of matches recorded.
    uint256 public totalMatches;

    /// @notice Represents a match between two players.
    /// @member id Unique identifier for the match.
    /// @member playerId1 First player's ID.
    /// @member playerId2 Second player's ID.
    /// @member score1 First player's score (0-11).
    /// @member score2 Second player's score (0-11).
    /// @member expGained1 Experience gained by the first player.
    /// @member expGained2 Experience gained by the second player.
    /// @member timestamp When the match was recorded.
    struct Match {
        uint256 id;
        uint256 playerId1;
        uint256 playerId2;
        uint8 score1;
        uint8 score2;
        uint32 expGained1;
        uint32 expGained2;
        uint256 timestamp;
    }

    /// @notice Mapping from match ID to match details.
    mapping(uint256 => Match) private _matchesById;

    /// @notice Mapping from player ID to their list of match IDs.
    mapping(uint256 => uint256[]) private _playerMatches;

    /// @notice Array of all match IDs.
    uint256[] private _allMatchIds;

    /// @notice Counter for the next match ID.
    uint256 private _nextMatchId = 1;

    /// @notice Emitted when a new match is recorded.
    /// @param matchId The ID of the recorded match.
    /// @param playerId1 First player's ID.
    /// @param playerId2 Second player's ID.
    /// @param score1 First player's score.
    /// @param score2 Second player's score.
    /// @param expGained1 Experience gained by the first player.
    /// @param expGained2 Experience gained by the second player.
    /// @param timestamp When the match was recorded.
    event MatchRecorded(
        uint256 indexed matchId,
        uint256 indexed playerId1,
        uint256 indexed playerId2,
        uint8 score1,
        uint8 score2,
        uint16 expGained1,
        uint16 expGained2,
        uint256 timestamp
    );

    /// @notice Emitted when ownership is transferred.
    /// @param previousOwner The previous owner's address.
    /// @param newOwner The new owner's address.
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /// @notice Emitted when the contract is paused.
    /// @param account The address that paused the contract.
    event Paused(address indexed account);

    /// @notice Emitted when the contract is unpaused.
    /// @param account The address that unpaused the contract.
    event Unpaused(address indexed account);

    /// @notice Emitted when the maximum matches per player is updated.
    /// @param previousValue The previous maximum value.
    /// @param newValue The new maximum value.
    event MaxMatchesPerPlayerUpdated(uint256 previousValue, uint256 newValue);

    /// @notice Emitted when the maximum total matches is updated.
    /// @param previousValue The previous maximum value.
    /// @param newValue The new maximum value.
    event MaxTotalMatchesUpdated(uint256 previousValue, uint256 newValue);

    /// @notice Initializes the contract, setting the owner to the deployer.
    constructor() {
        _owner = msg.sender;
        _paused = false;
        emit OwnershipTransferred(address(0), _owner);
    }

    /// @notice Modifier to restrict access to the contract owner.
    modifier onlyOwner() {
        require(msg.sender == _owner, "Not owner");
        _;
    }

    /// @notice Modifier to restrict access when the contract is not paused.
    modifier whenNotPaused() {
        require(!_paused, "Contract is paused");
        _;
    }

    /// @notice Returns the address of the current owner.
    /// @return The address of the owner.
    function owner() external view returns (address) {
        return _owner;
    }

    /// @notice Returns whether the contract is paused.
    /// @return True if the contract is paused, false otherwise.
    function paused() external view returns (bool) {
        return _paused;
    }

    /// @notice Returns the maximum number of matches allowed per player.
    /// @return The maximum number of matches per player.
    function maxMatchesPerPlayer() external view returns (uint256) {
        return _maxMatchesPerPlayer;
    }

    /// @notice Returns the maximum total number of matches allowed in the contract.
    /// @return The maximum total number of matches.
    function maxTotalMatches() external view returns (uint256) {
        return _maxTotalMatches;
    }

    /// @notice Transfers ownership of the contract to a new account.
    /// @dev Can only be called by the current owner.
    /// @param newOwner The address of the new owner.
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is zero address");
        address previousOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }

    /// @notice Pauses the contract, disabling most functionality.
    /// @dev Can only be called by the owner.
    function pause() external onlyOwner {
        require(!_paused, "Already paused");
        _paused = true;
        emit Paused(msg.sender);
    }

    /// @notice Unpauses the contract, re-enabling functionality.
    /// @dev Can only be called by the owner.
    function unpause() external onlyOwner {
        require(_paused, "Not paused");
        _paused = false;
        emit Unpaused(msg.sender);
    }

    /// @notice Updates the maximum number of matches allowed per player.
    /// @dev Can only be called by the owner.
    /// @param newValue The new maximum value.
    function setMaxMatchesPerPlayer(uint256 newValue) external onlyOwner {
        require(newValue > 0, "Value must be > 0");
        uint256 previous = _maxMatchesPerPlayer;
        _maxMatchesPerPlayer = newValue;
        emit MaxMatchesPerPlayerUpdated(previous, newValue);
    }

    /// @notice Updates the maximum total number of matches allowed in the contract.
    /// @dev Can only be called by the owner.
    /// @param newValue The new maximum value.
    function setMaxTotalMatches(uint256 newValue) external onlyOwner {
        require(newValue > 0, "Value must be > 0");
        uint256 previous = _maxTotalMatches;
        _maxTotalMatches = newValue;
        emit MaxTotalMatchesUpdated(previous, newValue);
    }

    /// @notice Records a new match between two players.
    /// @dev Can only be called by the owner when the contract is not paused.
    /// @param playerId1 First player's ID.
    /// @param playerId2 Second player's ID.
    /// @param score1 First player's score (0-11).
    /// @param score2 Second player's score (0-11).
    /// @param expGained1 Experience gained by the first player.
    /// @param expGained2 Experience gained by the second player.
    function recordMatch(
        uint256 playerId1,
        uint256 playerId2,
        uint8 score1,
        uint8 score2,
        uint16 expGained1,
        uint16 expGained2
    ) external onlyOwner whenNotPaused {

        require(_allMatchIds.length < _maxTotalMatches, "Maximum matches storage reached");
        require(_playerMatches[playerId1].length < _maxMatchesPerPlayer, "Maximum matches storage reached for player 1");
        require(_playerMatches[playerId2].length < _maxMatchesPerPlayer, "Maximum matches storage reached for player 2");
        require(playerId1 != playerId2, "Players must differ");
        require(score1 <= 11 && score2 <= 11, "Scores must be between 0 and 11");

        uint256 matchId = _nextMatchId;

        _matchesById[matchId] = Match({
            id: matchId,
            playerId1: playerId1,
            playerId2: playerId2,
            score1: score1,
            score2: score2,
            expGained1: expGained1,
            expGained2: expGained2,
            timestamp: block.timestamp
        });

        _playerMatches[playerId1].push(matchId);
        _playerMatches[playerId2].push(matchId);
        _allMatchIds.push(matchId);

        _nextMatchId++;
        totalMatches++;
        emit MatchRecorded(
            matchId,
            playerId1,
            playerId2,
            score1,
            score2,
            expGained1,
            expGained2,
            block.timestamp
        );
    }

    /// @notice Retrieves a match by its ID.
    /// @param matchId The ID of the match to retrieve.
    /// @return The match details.
    function getMatch(uint256 matchId) external view returns (Match memory) {
        Match memory matchData = _matchesById[matchId];
        require(matchData.timestamp != 0, "Match not found");
        return matchData;
    }

    /// @notice Retrieves a list of matches, ordered from most recent to oldest.
    /// @dev If count is 0, returns all matches starting from the offset.
    /// @param offset The starting offset from the end of the list.
    /// @param count The maximum number of matches to return (max 100).
    /// @return An array of matches.
    function getMatches(uint256 offset, uint256 count) external view returns (Match[] memory) {
        require(count <= 100, "Max 100 matches per request");
        uint256 length = _allMatchIds.length;
        if (offset >= length) {
            return new Match[](0);
        }

        uint256 available = length - offset;
        if (count == 0) {
            count = 100;
        }
        if (count > available) {
            count = available;
        }

        Match[] memory matches = new Match[](count);
        for (uint256 i = 0; i < count; i++) {
            uint256 matchId = _allMatchIds[length - 1 - offset - i];
            matches[i] = _matchesById[matchId];
        }
        return matches;
    }

    /// @notice Retrieves a list of matches for a specific player, ordered from most recent to oldest.
    /// @dev If count is 0, returns all matches starting from the offset.
    /// @param playerId The ID of the player.
    /// @param offset The starting offset from the end of the list.
    /// @param count The maximum number of matches to return (max 100).
    /// @return An array of matches.
    function getPlayerMatches(uint256 playerId, uint256 offset, uint256 count) external view returns (Match[] memory) {
        require(count <= 100, "Max 100 matches per request");

        uint256[] memory playerMatchIds = _playerMatches[playerId];
        uint256 length = playerMatchIds.length;

        if (offset >= length) {
            return new Match[](0);
        }

        uint256 available = length - offset;
        if (count == 0) {
            count = 100;
        }
        if (count > available) {
            count = available;
        }

        Match[] memory matches = new Match[](count);
        for (uint256 i = 0; i < count; i++) {
            uint256 matchId = playerMatchIds[length - 1 - offset - i];
            matches[i] = _matchesById[matchId];
        }
        return matches;
    }

    /// @notice Retrieves the number of matches for a specific player.
    /// @param playerId The ID of the player.
    /// @return The number of matches for the player.
    function getPlayerMatchCount(uint256 playerId) external view returns (uint256) {
        return _playerMatches[playerId].length;
    }

    /// @notice Returns the total number of matches recorded in the contract.
    /// @return The total number of matches.
    function getTotalMatchesCount() external view returns (uint256) {
        return totalMatches;
    }
}