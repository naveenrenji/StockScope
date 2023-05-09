import React, { useState } from "react";
import "./Card.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import { XCircleFill } from "react-bootstrap-icons";

// parent Card

const Card = (props) => {
  return (
    <motion.div layout>
      <CompactCard param={props} />
    </motion.div>
  );
};

// Compact Card
function CompactCard({ param }) {
  return (
    <motion.div
      className="CompactCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId={`expandableCard-${param.id}`}
      onClick={() =>
        (window.location.href = `http://localhost:3000/stock/summary/${param.symbol}`)
      }
    >
      <div className="radialBar">
        <CircularProgressbar
          value={param.barValue}
          text={`${param.barValue}%`}
        />
        <span>{param.title}</span>
      </div>
      <div className="detail">
        <span>${param.value}</span>
        <span>Last 24 hours</span>
      </div>
    </motion.div>
  );
}

// // Expanded Card
// function ExpandedCard({ param, setExpanded }) {
//   const data = {
//     options: {
//       chart: {
//         type: "area",
//         height: "auto",
//       },

//       dropShadow: {
//         enabled: false,
//         enabledOnSeries: undefined,
//         top: 0,
//         left: 0,
//         blur: 3,
//         color: "#ffffff",
//         opacity: 0.35,
//       },

//       fill: {
//         colors: ["#fff"],
//         type: "gradient",
//       },
//       dataLabels: {
//         enabled: false,
//       },
//       stroke: {
//         curve: "smooth",
//         colors: ["white"],
//       },
//       tooltip: {
//         x: {
//           format: "dd/MM/yy HH:mm",
//         },
//       },
//       grid: {
//         show: true,
//       },
//       xaxis: {
//         type: "datetime",
//         categories: [
//           "2018-09-19T00:00:00.000Z",
//           "2018-09-19T01:30:00.000Z",
//           "2018-09-19T02:30:00.000Z",
//           "2018-09-19T03:30:00.000Z",
//           "2018-09-19T04:30:00.000Z",
//           "2018-09-19T05:30:00.000Z",
//           "2018-09-19T06:30:00.000Z",
//           "2018-09-19T07:30:00.000Z",
//           "2018-09-19T08:30:00.000Z",
//           "2018-09-19T09:30:00.000Z",
//           "2018-09-19T10:30:00.000Z",
//           "2018-09-19T11:30:00.000Z",
//           "2018-09-19T12:30:00.000Z",
//         ],
//       },
//     },
//   };

//   return (
//     <motion.div
//       className="ExpandedCard"
//       style={{
//         background: param.color.backGround,
//         boxShadow: param.color.boxShadow,
//       }}
//       layoutId="expandableCard"
//     >
//       <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
//         <XCircleFill onClick={setExpanded} size={30} />
//       </div>
//       <span>{param.title}</span>
//       <div className="chartContainer">
//         <Chart options={data.options} series={param.series} type="area" />
//       </div>
//       <span>Last 24 hours</span>
//     </motion.div>
//   );
// }

export default Card;
