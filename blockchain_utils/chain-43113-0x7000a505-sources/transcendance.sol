// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract transcendancePong {

    // tournamentId -> winnerUserId
    mapping(uint256 => uint256) private winners;

    // userId -> list of tournamentIds won
    mapping(uint256 => uint256[]) private userWins;

    event TournamentRecorded(
        uint256 indexed tournamentId,
        uint256 indexed userId
    );

    function recordTournament(uint256 tournamentId, uint256 userId) external {
        require(tournamentId > 0, "Invalid tournamentId");
        require(userId > 0, "Invalid userId");
        require(winners[tournamentId] == 0, "Tournament already recorded");

        winners[tournamentId] = userId;
        userWins[userId].push(tournamentId);

        emit TournamentRecorded(tournamentId, userId);
    }

    function getResult(uint256 tournamentId) external view returns (uint256) {
        return winners[tournamentId]; // 0 si pas encore enregistre
    }

    function getUserResults(uint256 userId) external view returns (uint256[] memory) {
        return userWins[userId];
    }
}
