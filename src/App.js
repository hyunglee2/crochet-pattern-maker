import React, { useRef, useState, useEffect } from "react";

const App = () => {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false); // 마우스 상태
  const cellSize = 20;
  const gridWidth = 20;
  const gridHeight = 20;
  const canvasWidth = 600; // 캔버스 전체 크기
  const canvasHeight = 600;
  const numberingMargin = 40; // 넘버링을 위한 여백 추가

  useEffect(() => {
    const img = new Image();
    img.src = "https://via.placeholder.com/20"; // 예시 이미지 URL
    img.onload = () => setImage(img);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // 그리드와 넘버링을 그리는 함수
    const drawGridWithNumbering = () => {
      context.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 초기화
      context.strokeStyle = "black";
      context.font = "12px Arial"; // 넘버링 폰트 설정

      // 그리드를 중앙에 배치하기 위해 시작 좌표 계산
      const startX = (canvasWidth - gridWidth * cellSize) / 2;
      const startY = (canvasHeight - gridHeight * cellSize) / 2;

      // 그리드 그리기
      for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
          const posX = startX + x * cellSize;
          const posY = startY + y * cellSize;
          context.strokeRect(posX, posY, cellSize, cellSize); // 각 셀의 경계선을 그림
        }
      }

      // 열 넘버링 (그리드의 위와 아래)
      for (let i = 0; i < gridWidth; i++) {
        const number = (i + 1).toString();
        const posX = startX + i * cellSize + cellSize / 2; // 칸 중앙에 맞추기

        const posYTop = startY - 10; // 그리드 위쪽 바깥에 배치
        const posYBottom = startY + gridHeight * cellSize + 20; // 그리드 아래쪽 바깥에 배치

        // 위쪽 넘버링
        context.fillText(number, posX, posYTop);

        // 아래쪽 넘버링
        context.fillText(number, posX, posYBottom);
      }

      // 행 넘버링 (그리드의 왼쪽과 오른쪽)
      for (let i = 0; i < gridHeight; i++) {
        const number = (i + 1).toString();
        const posY = startY + i * cellSize + cellSize / 2; // 칸 중앙에 맞추기

        const posXLeft = startX - 25; // 왼쪽 바깥에 배치
        const posXRight = startX + gridWidth * cellSize + 5; // 오른쪽 바깥에 배치

        // 왼쪽 넘버링
        context.fillText(number, posXLeft, posY);

        // 오른쪽 넘버링
        context.fillText(number, posXRight, posY);
      }
    };

    drawGridWithNumbering(); // 그리드 및 넘버링 그리기
  }, [image]);

  const drawImageAtPosition = (x, y) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // 그리드가 중앙에 위치하도록 조정한 좌표
    const startX = (canvasWidth - gridWidth * cellSize) / 2;
    const startY = (canvasHeight - gridHeight * cellSize) / 2;

    // 클릭한 칸의 좌표 계산
    const col = Math.floor((x - startX) / cellSize) * cellSize + startX;
    const row = Math.floor((y - startY) / cellSize) * cellSize + startY;

    // 그리드 내부에만 이미지 그리기
    if (
      image &&
      col >= startX &&
      col < startX + gridWidth * cellSize &&
      row >= startY &&
      row < startY + gridHeight * cellSize
    ) {
      context.drawImage(image, col, row, cellSize, cellSize);
    }
  };

  const handleMouseDown = (event) => {
    setIsMouseDown(true); // 마우스가 눌리면 상태 변경
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    drawImageAtPosition(x, y);
  };

  const handleMouseMove = (event) => {
    if (isMouseDown) {
      // 마우스가 눌려있는 동안만 실행
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      drawImageAtPosition(x, y);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false); // 마우스가 떼어지면 상태 변경
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={canvasWidth} // 캔버스 너비 설정
        height={canvasHeight} // 캔버스 높이 설정
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // 마우스가 캔버스 밖으로 나가면 드래그 종료
        style={{ border: "1px solid black" }}
      />
    </div>
  );
};

export default App;
