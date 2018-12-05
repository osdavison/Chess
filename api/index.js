import express from "express";
const router = express.Router();

var moves = "";

router.get("/moves", (_req, res) => {
  res.send({ moves });
});

router.post("/moves/reset", (_req, res) => {
  moves = "";
  res.send({ moves });
});

router.post("/moves", (req, res) => {
  moves = req.body.moves;
  res.send({ moves });
});

// DEBUG v v v v v v v v v v
router.get("/moves/endgame", (_req, res) => {
  moves =
    "e4 e5 Nf3 f6 Nxe5 fxe5 Qh5+ Ke7 Qxe5+ Kf7 Bc4+ d5 Bxd5+ Kg6 h4 h5 Bxb7 Bxb7 Qf5+ Kh6 d4+ g5 Qf7 Qe7 hxg5+ Qxg5";
  res.send({ moves });
});

router.get("/moves/:move", (req, res) => {
  moves += ` ${req.params.move}`;
  res.send({ moves });
});
// DEBUG ^ ^ ^ ^ ^ ^ ^ ^ ^ ^
export default router;
