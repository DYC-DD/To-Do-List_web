import React, { useState } from "react";
import { TiChevronLeftOutline, TiChevronRightOutline } from "react-icons/ti";
import "../styles/List.css"; // 样式文件

const CARDS = 10; // 卡片數量
const MAX_VISIBILITY = 3; // 最大可見卡片數量

// 卡片組件
const Card = ({ title, content }) => (
  <div className="card">
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
);

// Carousel 主組件
const Carousel = () => {
  const [active, setActive] = useState(0); // 活動卡片索引

  return (
    <div className="carousel">
      {/* 左側導航按鈕 */}
      {active > 0 && (
        <button
          className="nav left"
          onClick={() => setActive((prev) => prev - 1)}
        >
          <TiChevronLeftOutline />
        </button>
      )}

      {/* 卡片內容渲染 */}
      {[...new Array(CARDS)].map((_, i) => (
        <div
          key={i}
          className="card-container"
          style={{
            "--active": i === active ? 1 : 0,
            "--offset": (active - i) / 3,
            "--direction": Math.sign(active - i),
            "--abs-offset": Math.abs(active - i) / 3,
            pointerEvents: active === i ? "auto" : "none",
            opacity: Math.abs(active - i) >= MAX_VISIBILITY ? "0" : "1",
            display: Math.abs(active - i) > MAX_VISIBILITY ? "none" : "block",
          }}
        >
          <Card
            title={`Card ${i + 1}`}
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
        </div>
      ))}

      {/* 右側導航按鈕 */}
      {active < CARDS - 1 && (
        <button
          className="nav right"
          onClick={() => setActive((prev) => prev + 1)}
        >
          <TiChevronRightOutline />
        </button>
      )}
    </div>
  );
};

export default Carousel;
