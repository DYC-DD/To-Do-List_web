import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TagsCloud.css";

class FibonacciSphere {
  constructor(N) {
    this.points = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const radius = Math.sqrt(1 - y ** 2);
      const a = goldenAngle * i;
      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;
      this.points.push([x, y, z]);
    }
  }
}

class TagsCloud {
  constructor(root) {
    this.root = root;
    this.size = this.root.offsetWidth;
    this.tags = root.querySelectorAll(".tag");
    this.sphere = new FibonacciSphere(this.tags.length);
    this.rotationAxis = [0.707, 0.707, 0]; // 預設旋轉軸
    this.rotationAngle = 0; // 初始旋轉角度
    this.rotationSpeed = 0.005; // 旋轉速度

    this.updatePositions();
    this.initEventListeners();
    this.root.classList.add("-loaded");
  }

  initEventListeners() {
    window.addEventListener("resize", this.updatePositions.bind(this));
    if (!this.isMobile()) {
      document.addEventListener("mousemove", this.onMouseMove.bind(this));
    }
  }

  isMobile() {
    return window.innerWidth <= 768;
  }

  updatePositions() {
    const sin = Math.sin(this.rotationAngle);
    const cos = Math.cos(this.rotationAngle);
    const [ux, uy, uz] = this.rotationAxis;

    const rotationMatrix = [
      [
        cos + ux ** 2 * (1 - cos),
        ux * uy * (1 - cos) - uz * sin,
        ux * uz * (1 - cos) + uy * sin,
      ],
      [
        uy * ux * (1 - cos) + uz * sin,
        cos + uy ** 2 * (1 - cos),
        uy * uz * (1 - cos) - ux * sin,
      ],
      [
        uz * ux * (1 - cos) - uy * sin,
        uz * uy * (1 - cos) + ux * sin,
        cos + uz ** 2 * (1 - cos),
      ],
    ];

    const N = this.tags.length;

    for (let i = 0; i < N; i++) {
      const [x, y, z] = this.sphere.points[i];

      const transformedX =
        rotationMatrix[0][0] * x +
        rotationMatrix[0][1] * y +
        rotationMatrix[0][2] * z;
      const transformedY =
        rotationMatrix[1][0] * x +
        rotationMatrix[1][1] * y +
        rotationMatrix[1][2] * z;
      const transformedZ =
        rotationMatrix[2][0] * x +
        rotationMatrix[2][1] * y +
        rotationMatrix[2][2] * z;

      const translateX = (this.size * transformedX) / 2;
      const translateY = (this.size * transformedY) / 2;
      const scale = (transformedZ + 2) / 3;

      const transform = `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`;
      const opacity = (transformedZ + 1.5) / 2.5;

      this.tags[i].style.transform = transform;
      this.tags[i].style.opacity = opacity;
    }
  }

  onMouseMove(e) {
    const rootRect = this.root.getBoundingClientRect();
    const deltaX = e.clientX - (rootRect.left + this.root.offsetWidth / 2);
    const deltaY = e.clientY - (rootRect.top + this.root.offsetHeight / 2);
    const a = Math.atan2(deltaX, deltaY) - Math.PI / 2;
    const axis = [Math.sin(a), Math.cos(a), 0];
    const delta = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const speed = delta / Math.max(window.innerHeight, window.innerWidth) / 10;

    this.rotationAxis = axis;
    this.rotationSpeed = speed;
  }

  update() {
    this.rotationAngle += this.rotationSpeed;
    this.updatePositions();
  }

  start() {
    this.update();
    this.frameRequestId = requestAnimationFrame(this.start.bind(this));
  }

  stop() {
    cancelAnimationFrame(this.frameRequestId);
  }
}

const TagsCloudComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.querySelector(".tags-cloud");
    const cloud = new TagsCloud(root);

    if (cloud.isMobile()) {
      cloud.rotationSpeed = 0.008;
    }

    cloud.start();

    return () => {
      cloud.stop();
    };
  }, []);

  const handleClick = () => {
    navigate("/home");
  };

  return (
    <div className="tags-container" onClick={handleClick}>
      <ul className="tags-cloud">
        {[
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
          "To-Do List",
        ].map((tag, index) => (
          <li key={index} className="tag">
            <span className="wrap">{tag}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagsCloudComponent;
