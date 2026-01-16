const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const cx = 300;
const cy = 300;
const R = 180;

// 固定条件（夏至）
const declination = 23.4;
const delta = declination * Math.PI / 180;

// UI
const latSlider = document.getElementById("lat");
const latValue = document.getElementById("latValue");

let showHint1 = false;

document.getElementById("hint1").addEventListener("click", () => {
  showHint1 = true;                         // 表示
  document.getElementById("hint2").disabled = false; // 次を有効化
  draw();
});


let showHint2 = false;

document.getElementById("hint2").addEventListener("click", () => {
  showHint2 = true;
  document.getElementById("hint3").disabled = false;
  draw();
});


let showHint3 = false;

document.getElementById("hint3").addEventListener("click", () => {
  showHint3 = true;
  document.getElementById("hint4").disabled = false;
  draw();
});


let showHint4 = false;



document.getElementById("reset").addEventListener("click", () => {

  // 表示フラグをすべて初期化
  showHint1 = false;
  showHint2 = false;
  showHint3 = false;
  showHint4 = false;

  // ボタン状態を初期化
  document.getElementById("hint2").disabled = true;
  document.getElementById("hint3").disabled = true;
  document.getElementById("hint4").disabled = true;

  // 再描画
  draw();
});



latSlider.addEventListener("input", draw);

document.getElementById("hint1").addEventListener("click", () => {
  showHint1 = true;   // 表示する
  draw();             // 画面を描き直す
});

document.getElementById("hint2").addEventListener("click", () => {
  showHint2 = true;   // 表示する
  draw();             // 画面を描き直す
});

document.getElementById("hint3").addEventListener("click", () => {
  showHint3 = true;   // 表示する
  draw();             // 画面を描き直す
});

document.getElementById("hint4").addEventListener("click", () => {
  showHint4 = true;   // 表示する
  draw();             // 画面を描き直す
});







// 初期描画
draw();

function draw() {

  const latitude = Number(latSlider.value);
  latValue.textContent = latitude + "°";

  const alpha = latitude * Math.PI / 180;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ===== 地球 =====
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();

// ===== 元の赤道（基準：水平・点線）=====
if (showHint1) {
ctx.save();

ctx.setLineDash([6, 6]);   // 点線
ctx.strokeStyle = "black";
ctx.lineWidth = 1;

ctx.beginPath();
ctx.moveTo(cx - R, cy);
ctx.lineTo(cx + R, cy);
ctx.stroke();



ctx.restore();

}

  // ===== 赤道（23.4° 時計回りに傾ける）=====
const equatorAngle = delta;   // 23.4°

// 赤道ベクトル
const ex = Math.cos(equatorAngle);
const ey = Math.sin(equatorAngle);

ctx.beginPath();
ctx.moveTo(
  cx - R * ex,
  cy - R * ey
);
ctx.lineTo(
  cx + R * ex,
  cy + R * ey
);
ctx.stroke();

// ラベル（少しずらす）
ctx.fillText(
  "赤道",
  cx + 60 * ey,
  cy + 40 * ex
);


  // ===== 地軸 =====
  const axisLength = R * 1.4;
  ctx.beginPath();
  ctx.moveTo(
    cx - axisLength * Math.sin(delta),
    cy + axisLength * Math.cos(delta)
  );
  ctx.lineTo(
    cx + axisLength * Math.sin(delta),
    cy - axisLength * Math.cos(delta)
  );
  ctx.stroke();

  ctx.fillText("N",
    cx + axisLength * Math.sin(delta) + 5,
    cy - axisLength * Math.cos(delta)
  );
  ctx.fillText("S",
    cx - axisLength * Math.sin(delta) - 15,
    cy + axisLength * Math.cos(delta)
  );

  // ===== 点O =====
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText("O", cx - 20, cy + 12);

  // ===== 赤道に垂直な点線 =====
  ctx.save();
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 1;
  const vLen = R * 1.6;
  ctx.beginPath();
  ctx.moveTo(cx, cy - vLen);
  ctx.lineTo(cx, cy + vLen);
  ctx.stroke();
  ctx.restore();

  // ===== 23.4°（基準点線 ↔ 地軸）=====
  

ctx.save();
  const verticalAngle = -Math.PI / 2;
  const axisAngle = -(Math.PI / 2 - delta);
  const tiltArcRadius = 55;

  ctx.beginPath();
  ctx.arc(cx, cy, tiltArcRadius, verticalAngle, axisAngle, false);
  ctx.stroke();

  const tiltMid = (verticalAngle + axisAngle) / 2;
  ctx.fillText(
    "23.4°",
    cx + 80 * Math.cos(tiltMid) - 10,
    cy + 80 * Math.sin(tiltMid) + 5
  );
  ctx.restore();


  // ===== 観測点 P =====
  const px = cx + R * Math.cos(alpha);
  const py = cy - R * Math.sin(alpha);

  ctx.beginPath();
  ctx.arc(px, py, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText("P", px + 2, py - 20);

  // ===== OP 点線 =====
  ctx.save();
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  const k = 1.5;
  ctx.moveTo(cx, cy);
  ctx.lineTo(
    cx + k * (px - cx),
    cy + k * (py - cy)
  );
  ctx.stroke();
  ctx.restore();

// ===== 説明用：α（点線OP × 赤道）=====


ctx.save();

// OP の方向角
const angleOP = Math.atan2(py - cy, px - cx);

// 赤道の方向角（すでに使っている equatorAngle）
const angleEQ = equatorAngle;

// 角度差（小さい方）
let dAlphaExplain = angleOP - angleEQ;
while (dAlphaExplain < -Math.PI) dAlphaExplain += 2 * Math.PI;
while (dAlphaExplain >  Math.PI) dAlphaExplain -= 2 * Math.PI;

// 半径は既存αより少し内側（重ならない）
const explainRadius = R - 140;

ctx.strokeStyle = "red";
ctx.lineWidth = 5;
ctx.setLineDash([]);

ctx.beginPath();
ctx.arc(
  cx,
  cy,
  explainRadius,
  angleEQ,
  angleEQ + dAlphaExplain,
  dAlphaExplain < 0
);
ctx.stroke();

// ラベル
const midExplain = angleEQ + dAlphaExplain / 2;
ctx.fillText(
  "α（緯度）",
  cx + (explainRadius + 15) * Math.cos(midExplain) - 1,
  cy + (explainRadius + 15) * Math.sin(midExplain) + 20
);

ctx.restore();



// ===== 23.4°（赤道 × 赤道から23.4°ずれた点線：中心O）=====

if (showHint2) {

ctx.save();

ctx.strokeStyle = "black";
ctx.lineWidth = 2;
ctx.setLineDash([]);

// 赤道の方向角
const equatorDir = equatorAngle;

// ★ 赤道から 23.4° ずれた方向
const shiftedDir = equatorAngle - delta;


// 半径
const arcR = 100;

// 黒い弧
ctx.beginPath();
ctx.arc(
  cx,
  cy,
  arcR,
  equatorDir,
  shiftedDir,
  true
);
ctx.stroke();

// ラベル
const mid234 = (equatorDir + shiftedDir) / 2;
ctx.fillText(
  "23.4°",
  cx + (arcR + 18) * Math.cos(mid234) - 10,
  cy + (arcR + 18) * Math.sin(mid234) + 5
);

ctx.restore();

}

  // ===== 入射光 =====
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(px + 140, py);
  ctx.lineTo(px, py);
  ctx.stroke();
  ctx.fillText("入射光", px + 100, py + 15);

  // ===== 接線 =====
  ctx.strokeStyle = "gray";
  ctx.beginPath();
  ctx.moveTo(
    px - 100 * Math.sin(alpha),
    py - 100 * Math.cos(alpha)
  );
  ctx.lineTo(
    px + 100 * Math.sin(alpha),
    py + 100 * Math.cos(alpha)
  );
  ctx.stroke();

  // ===== θ（南中高度）=====
  const tx = -Math.sin(alpha);
  const ty = -Math.cos(alpha);
  const tangentAngle = Math.atan2(ty, tx);
  const lightAngle = Math.PI;

  let dTheta = lightAngle - tangentAngle;
  while (dTheta < -Math.PI) dTheta += 2 * Math.PI;
  while (dTheta >  Math.PI) dTheta -= 2 * Math.PI;

  const startTheta = tangentAngle + Math.PI;
  const endTheta = startTheta + dTheta;

  ctx.strokeStyle = "magenta";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(px, py, 60, startTheta, endTheta, dTheta < 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(px, py, 56, startTheta, endTheta, dTheta < 0);
  ctx.stroke();

  const midTheta = (startTheta + endTheta) / 2;
  ctx.fillText(
    "θ（南中高度）",
    px + 100 * Math.cos(midTheta) - 20,
    py + 100 * Math.sin(midTheta)
  );

 // ===== α（緯度）：点P版（中心Oと同じ描き方）=====

if (showHint4) {


ctx.strokeStyle = "blue";
ctx.lineWidth = 5;
ctx.beginPath();
ctx.arc(
  px,        // 中心を点Pに
  py,
  45,        // 半径（調整可）
  0,         // 開始角は同じ
  -alpha,    // 終了角も同じ
  true
);
ctx.stroke();

// 文字位置（弧の中央方向）
const midAlphaP = -alpha / 2;
ctx.fillText(
  "α（緯度）- 23.4°",
  px + 65 * Math.cos(midAlphaP) - 10,
  py + 65 * Math.sin(midAlphaP) + 5
);

}

  // ===== α（中心角）=====
  
if (showHint3) {


ctx.strokeStyle = "blue";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, 70, 0, -alpha, true);
  ctx.stroke();

  const midAlpha = -alpha / 2;
  ctx.fillText(
    "α（緯度）- 23.4°",
    cx + 95 * Math.cos(midAlpha) - 10,
    cy + 95 * Math.sin(midAlpha) + 5
  );
}

}


