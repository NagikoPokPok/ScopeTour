
      // Tải modal.html vào modal-container
      fetch("./component/modal-status-action-success.html")
        .then(response => response.text())
        .then(html => {
          document.getElementById("modal-status-action-container").innerHTML = html;
          
          // Ẩn tiêu đề mặc định để tránh nhấp nháy
          const modalTitleElement = document.querySelector("#modal-success-action .modal-title");
          if (modalTitleElement) {
            modalTitleElement.style.visibility = "hidden"; // Ẩn tiêu đề ngay khi tải
          }
        });
    
      // Hàm hiển thị modal với tiêu đề tùy chỉnh
      function showModalActionSuccess(title = "Default Title") {
        const modalElement = document.getElementById("modal-success-action");
        const modalTitleElement = modalElement.querySelector(".modal-title");
    
        if (modalTitleElement) {
            modalTitleElement.innerText = title;
            modalTitleElement.style.visibility = "visible"; // Đảm bảo tiêu đề hiển thị
        } else {
            console.error("Không tìm thấy phần tử modal-title!");
            return;
        }
    
        // Tạo instance của modal Bootstrap
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
    
        // Tự động đóng modal sau 1.5 giây
        setTimeout(() => {
          modalInstance.hide();
          
          // Xóa backdrop nếu nó vẫn tồn tại
          const backdrops = document.querySelectorAll(".modal-backdrop");
          backdrops.forEach(backdrop => backdrop.remove());
      
          // Khắc phục trường hợp body vẫn bị class `modal-open`
          document.body.classList.remove("modal-open");
          document.body.style.overflow = "auto"; // Nếu cần
      }, 1500);
      
    }
    
    