import express from "express";

const app = express();
app.use(express.json());

const tournaments = [
  {
    id: "T-2026-0001",
    start_date: "2026-01-14",
    end_date: "2026-01-27",
    prize_list: [
      { prize_rank: "1", prize_value: "£2,000 cash" },
      { prize_rank: "2", prize_value: "£1,000 cash" },
      { prize_rank: "3", prize_value: "£500 cash" },
      { prize_rank: "4-10", prize_value: "£100 bonus" },
      { prize_rank: "11-50", prize_value: "£20 free spins" }
    ],
    type: "Slots",
    leaderboard: [
      { leaderboard_rank: 1, leaderboard_player_id: "C102938", score: 18450 },
      { leaderboard_rank: 2, leaderboard_player_id: "C204857", score: 17910 },
      { leaderboard_rank: 3, leaderboard_player_id: "C998123", score: 16775 }
    ],
    games: ["Gates of Olympus", "Sweet Bonanza", "Book of Dead", "Big Bass Bonanza"],
    promoted_provider: "Pragmatic Play"
  },
  {
    id: "T-2026-0002",
    start_date: "2026-01-19",
    end_date: "2026-02-07",
    prize_list: [
      { prize_rank: "1", prize_value: "iPhone 16 (or £900 cash alternative)" },
      { prize_rank: "2", prize_value: "£500 cash" },
      { prize_rank: "3", prize_value: "£250 cash" },
      { prize_rank: "4-25", prize_value: "£25 bonus" }
    ],
    type: "Live Casino",
    leaderboard: [
      { leaderboard_rank: 1, leaderboard_player_id: "C771002", score: 3250 },
      { leaderboard_rank: 2, leaderboard_player_id: "C118833", score: 3110 },
      { leaderboard_rank: 3, leaderboard_player_id: "C550901", score: 2980 }
    ],
    games: ["Lightning Roulette", "Crazy Time", "Blackjack VIP", "Baccarat Squeeze"],
    promoted_provider: "Evolution"
  },
  {
    id: "T-2026-0003",
    start_date: "2026-03-10",
    end_date: "2026-03-17",
    prize_list: [
      { prize_rank: "1", prize_value: "£1,500 cash" },
      { prize_rank: "2", prize_value: "£750 cash" },
      { prize_rank: "3", prize_value: "£300 cash" },
      { prize_rank: "4-20", prize_value: "£50 bonus" },
      { prize_rank: "21-100", prize_value: "£10 bonus" }
    ],
    type: "Sports (Accumulator)",
    leaderboard: [
      { leaderboard_rank: 1, leaderboard_player_id: "C440012", score: 126 },
      { leaderboard_rank: 2, leaderboard_player_id: "C220991", score: 118 },
      { leaderboard_rank: 3, leaderboard_player_id: "C301770", score: 112 }
    ],
    games: ["Football Accas", "Tennis Multiples", "NBA Parlays"],
    promoted_provider: "In-house Sportsbook"
  }
];

// Health (כדי לוודא שהשירות חי)
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ה-endpoint שאת צריכה ל-Optimove
// תומך בסינון לפי:
// id, type, promoted_provider, game (contains), leaderboard_player_id (contains), prize_rank (contains), active_on (range)
app.get("/tournaments", (req, res) => {
  const {
    id,
    type,
    promoted_provider,
    game,
    leaderboard_player_id,
    prize_rank,
    active_on
  } = req.query;

  const filtered = tournaments.filter((t) => {
    if (id && t.id !== String(id)) return false;
    if (type && t.type !== String(type)) return false;
    if (promoted_provider && t.promoted_provider !== String(promoted_provider)) return false;

    if (game && !t.games.some((g) => g.toLowerCase() === String(game).toLowerCase())) return false;

    if (
      leaderboard_player_id &&
      !t.leaderboard.some((row) => row.leaderboard_player_id === String(leaderboard_player_id))
    ) return false;

    if (
      prize_rank &&
      !t.prize_list.some((p) => p.prize_rank === String(prize_rank))
    ) return false;

    if (active_on) {
      const d = String(active_on);
      if (d < t.start_date || d > t.end_date) return false;
    }

    return true;
  });

  res.status(200).json(filtered);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
