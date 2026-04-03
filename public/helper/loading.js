// helpers/loading.js

const Loading = (() => {
  let overlay = null;

  const createLoading = () => {
    // Overlay
    overlay = document.createElement("div");
    overlay.id = "global-loading";

    overlay.innerHTML = `
      <div class="loading-spinner"></div>
    `;

    document.body.appendChild(overlay);

    // Style
    const style = document.createElement("style");
    style.innerHTML = `
      #global-loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        pointer-events: all;
      }

      .loading-spinner {
        width: 60px;
        height: 60px;
        border: 6px solid #ddd;
        border-top: 6px solid #ffffff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `;
    document.head.appendChild(style);
  };

  const show = () => {
    if (!overlay) {
      createLoading();
    }
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden"; // chặn scroll
  };

  const hide = () => {
    if (overlay) {
      overlay.style.display = "none";
      document.body.style.overflow = "";
    }
  };

  return {
    show,
    hide
  };
})();

export default Loading;
