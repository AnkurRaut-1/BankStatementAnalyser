import React from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

export default function LineChart(p) {
    let data = undefined;
    let months = [];
    let averageBalance = [];
    let monthEndBalance = [];
    const labels = months;

    data = {
        labels: labels,
        datasets: [
            {
                label: "Average Balance (in Rs.)",
                backgroundColor: "#003459",
                borderColor: "#003459",
                data: averageBalance,
            },
            {
                label: "Balance (in Rs.)",
                backgroundColor: "#029BFE",
                borderColor: "#029BFE",
                data: monthEndBalance,
            }
        ],
    };

    const monthwiseAmount = (obj, arrMonths, arrAmounts) => {
        if (obj.JAN != undefined) {
            arrAmounts.push(obj.JAN);
            let found = 0;
            arrMonths.forEach(m => {
                if (m == "JAN")
                    found = 1;
            });
            if (found == 0)
                arrMonths.push("JAN");
        }
        if (obj.FEB != undefined) {
            arrAmounts.push(obj.FEB);
            let found = 0;
            arrMonths.forEach(m => {
                if (m == "FEB")
                    found = 1;
            });
            if (found == 0)
                arrMonths.push("FEB");
        }
        if (obj.MAR != undefined) {
            arrAmounts.push(obj.MAR);
            let found = 0;
            arrMonths.forEach(m => {
                if (m == "MAR")
                    found = 1;
            });
            if (found == 0)
                arrMonths.push("MAR");
        }
        if (obj.APR != undefined) {
            arrAmounts.push(obj.APR);
            let found = 0;
            arrMonths.forEach(m => {
                if (m == "APR")
                    found = 1;
            });
            if (found == 0)
                arrMonths.push("APR");
        }
        if (obj.MAY != undefined) {
            arrAmounts.push(obj.MAY);
            let found = 0;
            arrMonths.forEach(m => {
                if (m == "MAY")
                    found = 1;
            });
            if (found == 0)
                arrMonths.push("MAY");
        }
        if (obj.JUN != undefined) {
            arrAmounts.push(obj.JUN);
            let found = 0;
            arrMonths.forEach(m => {
                if (m == "JUN")
                    found = 1;
            });
            if (found == 0)
                arrMonths.push("JUN");
        }
        if (obj.JUL != undefined) {
            arrAmounts.push(obj.JUL);
            let found = 0;
            arrMonths.forEach(m => {
                if (m == "JUL")
                    found = 1;
            });
            if (found == 0)
                arrMonths.push("JUL");
        }
        if (obj.AUG != undefined) {
            arrAmounts.push(obj.AUG);
            let found = 0;
            arrMonths.forEach(m => {
                if (m == "AUG")
                    found = 1;
            });
            if (found == 0)
                arrMonths.push("AUG");
        }
        if (obj.SEP != undefined) {
            arrAmounts.push(obj.SEP);
            let found = 0;
            arrMonths.forEach(m => {
                if (m == "SEP")
                    found = 1;
            });
            if (found == 0)
                arrMonths.push("SEP");
        }
        if (obj.OCT != undefined) {
            arrAmounts.push(obj.OCT);
            let found = 0;
            arrMonths.forEach(m => {
                if (m == "OCT")
                    found = 1;
            });
            if (found == 0)
                arrMonths.push("OCT");
        }
        if (obj.NOV != undefined) {
            arrAmounts.push(obj.NOV);
            let found = 0;
            arrMonths.forEach(m => {
                if (m == "NOV")
                    found = 1;
            });
            if (found == 0)
                arrMonths.push("NOV");
        }
        if (obj.DEC != undefined) {
            arrAmounts.push(obj.DEC);
            let found = 0;
            arrMonths.forEach(m => {
                if (m == "DEC")
                    found = 1;
            });
            if (found == 0)
                arrMonths.push("DEC");
        }
    }

    monthwiseAmount((JSON.parse(p.data)), months, averageBalance);
    monthwiseAmount((JSON.parse(p.data_)), months, monthEndBalance);

    return (
        <div className="w-100">
            <Line data={data} />
        </div>
    );
}