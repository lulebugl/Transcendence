import { apiRequest } from "./api";




// const username = "User_" + playerIdRef.current.slice(0, 4);

    //   await fetch('/api/matchmaking/join', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ username, playerId: playerIdRef.current })
    //   });

	//   const res = await fetch(`/api/matchmaking/status?playerId=${playerIdRef.current}`);
    //       const data = await res.json();
    //       if (data.status === "matched") {
    //         setStatus("matched");
    //         navigate(`/pong-test?matchId=${data.matchId}&playerId=${playerIdRef.current}`);
    //       } else if (data.status === "waiting") {
    //         setQueueSize(data.queueSize);
    //       }

// export const gameApi = {
//     joinQueue: async (username: string, playerId: string) => {
//         return apiRequest<void>("/api/matchmaking/join", {
//             method: "POST",
//             body: JSON.stringify({ username, playerId: playerId.current })
//         });
//     },
// };
