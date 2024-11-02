import { useEffect, useState } from "react";
import {
  MouseParallaxContainer,
  MouseParallaxChild,
} from "react-parallax-mouse";

const pixelObj = {
  pixel_6: {
    size: 6,
    factor: 0.06,
  },
  pixel_12: {
    size: 12,
    factor: 0.12,
  },
  pixel_18: {
    size: 18,
    factor: 0.18,
  },
  pixel_24: {
    size: 24,
    factor: 0.24,
  },
  pixel_30: {
    size: 30,
    factor: 0.3,
  },
};

// function calcPixelSize() {
//   return Math.floor(Math.random() * (30 + 10 + 1) + 10);
// }

// function calcFactor(pixelSize) {
//   let factor = (Math.random() / 5).toFixed(2);
//   if (pixelSize >= 20 && factor < 0.2) {
//     while (factor > 0.05) {
//       factor = (Math.random() / 5).toFixed(2);
//     }
//   }
//   return factor;
// }

const Parallax = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const colors = [
    "rgba(113, 124, 179, 1)",
    "rgba(209, 100, 91, 1)",
    "rgba(231, 200, 140, 1)",
    "rgba(240, 154, 100, 1)",
    "rgba(50, 150, 148, 1)",
    "rgba(148, 93, 78, 1)",
    "rgba(235, 140, 128, 1)"
  ]

  const far_away_pixels = [
    //
  ]

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/** @TODO set pixels with parallax */}
      <MouseParallaxContainer
        containerStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100dvw",
          height: "100dvh",
        }}
      >
        <MouseParallaxChild
          factorX={pixelObj.pixel_6.factor}
          factorY={pixelObj.pixel_6.factor}
        >
          <div
            style={{
              width: `${pixelObj.pixel_6.size}px`,
              height: `${pixelObj.pixel_6.size}px`,
              backgroundColor: "cyan",
            }}
          ></div>
        </MouseParallaxChild>
        <MouseParallaxChild
          factorX={pixelObj.pixel_12.factor}
          factorY={pixelObj.pixel_12.factor}
        >
          <div
            style={{
              width: `${pixelObj.pixel_12.size}px`,
              height: `${pixelObj.pixel_12.size}px`,
              backgroundColor: "blue",
            }}
          ></div>
        </MouseParallaxChild>
        <MouseParallaxChild
          factorX={pixelObj.pixel_18.factor}
          factorY={pixelObj.pixel_18.factor}
        >
          <div
            style={{
              width: `${pixelObj.pixel_18.size}px`,
              height: `${pixelObj.pixel_18.size}px`,
              backgroundColor: "green",
            }}
          ></div>
        </MouseParallaxChild>
        <MouseParallaxChild
          factorX={pixelObj.pixel_24.factor}
          factorY={pixelObj.pixel_24.factor}
        >
          <div
            style={{
              width: `${pixelObj.pixel_24.size}px`,
              height: `${pixelObj.pixel_24.size}px`,
              backgroundColor: "black",
            }}
          ></div>
        </MouseParallaxChild>
        <MouseParallaxChild
          factorX={pixelObj.pixel_30.factor}
          factorY={pixelObj.pixel_30.factor}
        >
          <div
            style={{
              width: `${pixelObj.pixel_30.size}px`,
              height: `${pixelObj.pixel_30.size}px`,
              backgroundColor: "orange",
            }}
          ></div>
        </MouseParallaxChild>
      </MouseParallaxContainer>
    </>
  );
};

export default Parallax;
