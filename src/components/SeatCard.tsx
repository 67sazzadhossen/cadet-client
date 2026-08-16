// components/SeatCard.tsx
import React from "react";
import { TStudent } from "@/types/index.type";

export type TSeatCardProps = {
  student: TStudent;
  examName?: string;
};

const SeatCard: React.FC<TSeatCardProps> = ({
  student,
  examName = "Monthly Test-February",
}) => {
  return (
    <div
      className="seat-card"
      style={{
        width: "90mm", // ফিক্সড উইডথ (A4 এর জন্য পারফেক্ট)
        height: "60mm", // ফিক্সড হাইট
        border: "1.5px dashed #000",
        padding: "8px",
        position: "relative",
        backgroundColor: "#fff",
        color: "#000",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Watermark Logo */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.12,
          zIndex: 0,
          width: "120px",
        }}
      >
        <img src="/logo.png" alt="logo" style={{ width: "100%" }} />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            margin: "0",
            textAlign: "center",
          }}
        >
          GAZIPURSHAHEEN CADET ACADEMY
        </h2>
        <p
          style={{
            fontSize: "11px",
            margin: "2px 0",
            textAlign: "center",
            borderBottom: "1px solid #000",
            paddingBottom: "2px",
          }}
        >
          {examName}
        </p>

        <div
          style={{
            margin: "5px 0",
            borderBottom: "1.5px solid #000",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              margin: "0",
              paddingBottom: "2px",
            }}
          >
            {student.name.englishName.toUpperCase()}
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "5px",
          }}
        >
          <div
            style={{
              textAlign: "left",
              fontSize: "16px",
              lineHeight: "1.6",
              fontWeight: "500",
            }}
          >
            <div>
              Academic Year : <strong>2026</strong>
            </div>
            <div>
              Student ID : <strong>{student.id}</strong>
            </div>
            <div>
              Class : <strong>{student.currentClass}</strong>
            </div>
          </div>

          <div
            style={{
              width: "65px",
              height: "75px",
              border: "1px solid #000",
              padding: "1px",
            }}
          >
            <img
              src={student.image?.url || "/placeholder-profile.png"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "",
            textAlign: "right",
            paddingRight: "",
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>
            Roll No. : {student.rollNo || "____"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeatCard;
