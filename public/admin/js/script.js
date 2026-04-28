document.addEventListener("DOMContentLoaded", () => {
    // Mobile Sidebar toggle logic
    const btnMenu = document.getElementById("mobile-menu-btn");
    const mobileSidebarContainer = document.getElementById("mobile-sidebar-container");
    const mobileSidebarOverlay = document.getElementById("mobile-sidebar-overlay");
    const mobileSidebarCloseBtns = document.querySelectorAll(".mobile-sidebar-close");

    if(btnMenu && mobileSidebarContainer) {
        btnMenu.addEventListener("click", () => {
            mobileSidebarContainer.classList.remove("hidden");
        });
    }

    const closeSidebar = () => {
        if(mobileSidebarContainer) {
            mobileSidebarContainer.classList.add("hidden");
        }
    };

    if(mobileSidebarOverlay) {
        mobileSidebarOverlay.addEventListener("click", closeSidebar);
    }

    mobileSidebarCloseBtns.forEach(btn => {
        btn.addEventListener("click", closeSidebar);
    });

    // Replace Lucide icons
    if(typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Auto close flash message
    const flashMessage = document.getElementById("flash-message");
    if(flashMessage) {
        setTimeout(() => {
            flashMessage.style.display = "none";
        }, 3000);
    }

    // Confirm delete popup
    const btnDeletes = document.querySelectorAll(".btn-delete-item");
    btnDeletes.forEach(btn => {
        btn.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa sự kiện này không?");
            if(isConfirm) {
                // Find parent form and submit
                btn.closest(".form-delete-item").submit();
            }
        });
    });
});
