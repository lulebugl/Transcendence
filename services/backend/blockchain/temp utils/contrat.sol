// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MatchStorage {

    address private _owner;
    bool private _paused;

    uint256 private _maxMatchesPerPlayer = 1000;
    uint256 private _maxTotalMatches = 10000;

    struct Match {
        uint256 id;
        uint256 playerId1;
        uint256 playerId2;
        uint256 score1;
        uint256 score2;
        uint256 timestamp;
    }

    mapping(uint256 => Match) private _matches;
    mapping(uint256 => uint256[]) private _playerMatches;
    uint256[] private _allMatchIds;
    uint256 private _nextMatchId = 1;

    // In term of gas : indexed cost a little bit more gas when recording a match, but no gas will be needed to retrieve data
    event MatchRecorded(
        uint256 indexed matchId,
        uint256 indexed playerId1,
        uint256 indexed playerId2,
        uint256 score1,
        uint256 score2,
        uint256 timestamp
    );

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Paused(address indexed account);
    event Unpaused(address indexed account);
    event MaxMatchesPerPlayerUpdated(uint256 previousValue, uint256 newValue);
    event MaxTotalMatchesUpdated(uint256 previousValue, uint256 newValue);

    constructor() {
        _owner = msg.sender;
        _paused = false;
        emit OwnershipTransferred(address(0), _owner);
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Not owner");
        _;
    }

    modifier whenNotPaused() {
        require(!_paused, "Contract is paused");
        _;
    }

    function owner() external view returns (address) {
        return _owner;
    }

    function paused() external view returns (bool) {
        return _paused;
    }

    function maxMatchesPerPlayer() external view returns (uint256) {
        return _maxMatchesPerPlayer;
    }

    function maxTotalMatches() external view returns (uint256) {
        return _maxTotalMatches;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is zero address");
        address previousOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }

    function pause() external onlyOwner {
        require(!_paused, "Already paused");
        _paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        require(_paused, "Not paused");
        _paused = false;
        emit Unpaused(msg.sender);
    }

    function setMaxMatchesPerPlayer(uint256 newValue) external onlyOwner {
        require(newValue > 0, "Value must be > 0");
        uint256 previous = _maxMatchesPerPlayer;
        _maxMatchesPerPlayer = newValue;
        emit MaxMatchesPerPlayerUpdated(previous, newValue);
    }

    function setMaxTotalMatches(uint256 newValue) external onlyOwner {
        require(newValue > 0, "Value must be > 0");
        uint256 previous = _maxTotalMatches;
        _maxTotalMatches = newValue;
        emit MaxTotalMatchesUpdated(previous, newValue);
    }

    // COST GAS
    function recordMatch(
        uint256 playerId1,
        uint256 playerId2,
        uint256 score1,
        uint256 score2
    ) external onlyOwner whenNotPaused {

        // ASK on limite ou pas ? (pour eviter gas potentiellement infini) autres solutions : permettre a l'admin de pause le contrat (pour demontrer la capacite a limiter une faille)
        require(_allMatchIds.length < _maxTotalMatches, "Too many matches total");
        require(_playerMatches[playerId1].length < _maxMatchesPerPlayer, "Too many matches for player 1");
        require(_playerMatches[playerId2].length < _maxMatchesPerPlayer, "Too many matches for player 2");

		
        uint256 matchId = _nextMatchId;
        _matches[matchId] = Match({
            id: matchId,
            playerId1: playerId1,
            playerId2: playerId2,
            score1: score1,
            score2: score2,
            timestamp: block.timestamp
        });

        // COST GAS
        _playerMatches[playerId1].push(matchId);
        // COST GAS
        _playerMatches[playerId2].push(matchId);
        // COST GAS
        _allMatchIds.push(matchId);

        _nextMatchId++;
        emit MatchRecorded(matchId, playerId1, playerId2, score1, score2, block.timestamp);
    }

    // Retrieve match by Id
    function getMatch(uint256 matchId) external view returns (Match memory) {
		require(_matches[matchId].id != 0, "Unknown match");

        return _matches[matchId];
    }

    // Retrieve the last X matches (from most recent to oldest)
    // If count = 0, return all matches
    function getMatches(uint256 count) external view returns (Match[] memory) {
        uint256 length = _allMatchIds.length;
        if (count == 0 || count > length) {
            count = length;
        }

        Match[] memory matches = new Match[](count);
        for (uint256 i = 0; i < count; i++) {
            matches[i] = _matches[_allMatchIds[length - 1 - i]];
        }
        return matches;
    }

    // Retrieve the last X matches from a player (from most recent to oldest)
    // If count = 0, return all matches
     function getPlayerMatches(uint256 playerId, uint256 count) external view returns (Match[] memory) {
        uint256[] memory playerMatchIds = _playerMatches[playerId];
        uint256 length = playerMatchIds.length;

        if (count == 0 || count > length) {
            count = length;
        }

        Match[] memory matches = new Match[](count);
        for (uint256 i = 0; i < count; i++) {
            matches[i] = _matches[playerMatchIds[length - 1 - i]];
        }
        return matches;
    }
}