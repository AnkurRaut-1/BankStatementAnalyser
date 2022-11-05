import React from "react";
import Chart from "chart.js/auto";
import { Pie, Doughnut } from "react-chartjs-2";

export default function PieChart(p) {
    let data = undefined;

    if (p.categorizedBy == "size") {
        let amount = [];
        amount.push(p.sm);
        amount.push(p.md);
        amount.push(p.lg);
        amount.push(0);
        data = {
            labels: ["Small", "Medium", "Large"],
            datasets: [
                {
                    label: "Size",
                    backgroundColor: ["#43C49B", "#05678C", "#003459"],
                    borderColor: "#fff",
                    data: amount,
                },
            ],
        };
    }

    if (p.categorizedBy == "modeOfPaymentCredit") {
        let modes = ["ATM", "IMPS", "NEFT", "UPI", "CASH Deposit", "Interest", "Auto Transaction", "Misc."];
        let amountOfModesOfCredits = [];
        (p.data).map((amt) => { amountOfModesOfCredits.push(amt) });
        data = {
            labels: modes,
            datasets: [
                {
                    label: "Modes of Payment",
                    backgroundColor: ["#4CB443", "#2A8686", "#43C49B", "#05678C", "#B7D0E3", "#3CC5B7", "#8C98AE", "#1C3456"],
                    borderColor: "#FFF",
                    data: amountOfModesOfCredits,
                },
            ],
        };
    }

    if (p.categorizedBy == "modeOfPaymentDebit") {
        let modes = ['ATM', 'IMPS or NEFT', 'UPI', 'EMI', 'By Bank', 'Misc.'];
        let amountOfModesOfDebits = p.data;
        data = {
            labels: modes,
            datasets: [
                {
                    label: "Modes of Payment",
                    backgroundColor: ["#4CB443", "#2A8686", "#05678C", "#B7D0E3", "#3CC5B7", "#1C3456"],
                    borderColor: "#FFF",
                    data: amountOfModesOfDebits,
                },
            ],
        };
    }

    //new chart for custom search of particulars
    let modes = [];
    let amounts = [];
    if (p.arrayType == "newMode") {
        modes = (p.modeName);
        amounts = (p.newModeData);
        data = {
            labels: modes,
            datasets: [
                {
                    label: "Modes of Payment",
                    backgroundColor: ["#4CB443", "#2A8686", "#05678C", "#B7D0E3", "#3CC5B7", "#1C3456", "#4CB443", "#2A8686", "#43C49B", "#05678C", "#B7D0E3", "#3CC5B7", "#8C98AE", "#1C3456"],
                    borderColor: "#FFF",
                    data: amounts,
                },
            ],
        };
    }

    return (
        <div className="w-100">
            <Doughnut data={data} />
        </div>
    );

}