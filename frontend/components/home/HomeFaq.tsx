"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Mở nhạc ở quán có cần giấy phép không?",
    answer:
      "Có. Phát nhạc phục vụ khách là hình thức sử dụng công khai. Gói MeloBiz bao gồm phạm vi cấp phép phù hợp cho điểm kinh doanh đã đăng ký.",
  },
  {
    question: "Một gói sử dụng được cho bao nhiêu địa điểm?",
    answer:
      "Mỗi gói áp dụng cho một điểm phát. Bạn có thể quản lý nhiều điểm phát và nhiều nhân viên trong cùng một tài khoản doanh nghiệp.",
  },
  {
    question: "Có xuất hóa đơn VAT và chứng từ không?",
    answer:
      "Có. Hồ sơ doanh nghiệp, hợp đồng, giấy chứng nhận và hóa đơn được quản lý tập trung trên cổng doanh nghiệp.",
  },
  {
    question: "Dùng thử có cần thẻ tín dụng không?",
    answer:
      "Không. Bạn có 14 ngày trải nghiệm toàn bộ kho nhạc và tính năng quản lý mà không cần nhập thẻ.",
  },
];

export function HomeFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="accordion">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <article key={faq.question} className={isOpen ? "open" : ""}>
            <button onClick={() => setOpenIndex(isOpen ? -1 : index)}>
              <span>{faq.question}</span>
              <i>{isOpen ? "−" : "+"}</i>
            </button>
            {isOpen && <p>{faq.answer}</p>}
          </article>
        );
      })}
    </div>
  );
}
