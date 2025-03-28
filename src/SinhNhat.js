import React, { useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import "./styles.css";

const SinhNhat = () => {
  const [birthDate, setBirthDate] = useState("");
  const [daysLeft, setDaysLeft] = useState(null);

  const calculateDaysLeft = async () => {
    if (!birthDate || !/^\d{2}\/\d{2}$/.test(birthDate)) {
      alert("Vui lòng nhập ngày sinh hợp lệ (dd/mm)!");
      return;
    }

    const [day, month] = birthDate.split("/").map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    let nextBirthday = new Date(currentYear, month - 1, day);
    if (nextBirthday < currentDate) {
      nextBirthday = new Date(currentYear + 1, month - 1, day);
    }

    const timeDiff = nextBirthday - currentDate;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    setDaysLeft(days);

    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Đếm ngược sinh nhật",
          body: `Còn ${days} ngày nữa là đến sinh nhật của bạn!`,
          id: 1,
        },
      ],
    });
  };

  const shareResult = async () => {
    if (daysLeft !== null) {
      try {
        await Share.share({
          title: "Đếm ngược sinh nhật",
          text: `Còn ${daysLeft} ngày đến sinh nhật của tôi!`,
          dialogTitle: "Chia sẻ kết quả",
        });
      } catch (error) {
        console.error("Lỗi khi chia sẻ:", error);
      }
    } else {
      alert("Vui lòng tính thời gian trước khi chia sẻ!");
    }
  };

  return (
    <div className="container">
      <h1>Đếm ngược sinh nhật</h1>
      <input
        type="text"
        placeholder="Nhập ngày sinh (dd/mm)"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
      />
      <button className="calculate" onClick={calculateDaysLeft}>
        Tính thời gian
      </button>
      {daysLeft !== null && (
        <>
          <p className="result">Còn {daysLeft} ngày đến sinh nhật tiếp theo!</p>
          <button className="share" onClick={shareResult}>
            Chia sẻ kết quả
          </button>
        </>
      )}
    </div>
  );
};

export default SinhNhat;
