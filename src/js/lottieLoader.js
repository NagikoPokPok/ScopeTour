function loadLottieAnimation(containerId, topic) {
    const topics = {
        "not-available": {
            src: "https://lottie.host/ac626f88-afce-4b9c-8f83-2d351be7e74c/RVlfmKGqw0.lottie",
            message: "No data available."
        },
        "not-found": {
            src: "https://lottie.host/219eb235-30c7-447b-93b3-0f6f900e69e1/X19ephF3PY.lottie",
            message: "No results found."
        },
        "error-loading": {
            src: "https://lottie.host/92caf8cd-9bb4-4840-8edc-c35fad683fee/SU6doYAqYn.lottie",
            message: "An error occurred."
        },
    };

    const { src, message } = topics[topic] || topics["not-available"]; // Mặc định là "not-available" nếu chủ đề không tồn tại.

    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Không tìm thấy container với ID:", containerId);
        return;
    }

    container.innerHTML = `
        <div id="status-of-list" class="d-flex justify-content-center align-items-center flex-column">
            <dotlottie-player 
                src="${src}" 
                background="transparent" speed="1" 
                loop autoplay>
            </dotlottie-player> 
            <p class="mt-2 fw-semibold fs-4">${message}</p>
        </div>
    `;
}


   
