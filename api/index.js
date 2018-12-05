import express from "express";
const router = express.Router();

var moves = "";

router.get("/moves", (req, res) => {
  res.send({
    moves
  });
});

router.post("/moves", (req, res) => {
  moves = req.body.moves;
  res.sendStatus(200);
});

// DEBUG v v v v v v v v v v
router.get("/moves/reset", (req, res) => {
  moves = "";
  res.sendStatus(200);
});
router.get("/moves/endgame", (req, res) => {
  moves =
    "e4 e5 Nf3 f6 Nxe5 fxe5 Qh5+ Ke7 Qxe5+ Kf7 Bc4+ d5 Bxd5+ Kg6 h4 h5 Bxb7 Bxb7 Qf5+ Kh6 d4+ g5 Qf7 Qe7 hxg5+ Qxg5";
  res.sendStatus(200);
});

router.get("/moves/:move", (req, res) => {
  moves += ` ${req.params.move}`;
  res.sendStatus(200);
});
// DEBUG ^ ^ ^ ^ ^ ^ ^ ^ ^ ^
export default router;
