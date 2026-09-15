document.addEventListener('DOMContentLoaded', () => {
    
    // collapsible side menu
    const menuTrigger = document.getElementById('menuTrigger');
    const menuClose = document.getElementById('menuClose');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    function openMenu() {
        sideMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if(menuTrigger) menuTrigger.addEventListener('click', openMenu);
    if(menuClose)   menuClose.addEventListener('click', closeMenu);
    if(menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // scroll to top
    const btnTop = document.getElementById("btnTop");

        function scrollFunction() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
            
            if (scrollTop > 300) {
                btnTop.classList.add("show");
            } else {
                btnTop.classList.remove("show");
            }
        }

        window.addEventListener('scroll', scrollFunction);

        btnTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
});


// dropdown list icon flip
    const wrappers = document.querySelectorAll(".select-wrapper");

    wrappers.forEach(wrapper => {
        const select = wrapper.querySelector("select");
        if (!select) return;
        let ignoreClick = false;
        select.addEventListener("click", function() {
            if (ignoreClick) {
                ignoreClick = false; 
                return;
            }

            requestAnimationFrame(() => {
                wrapper.classList.toggle("active");
            });
        });

        select.addEventListener("change", function() {
            wrapper.classList.remove("active");
            this.blur();
            
            ignoreClick = true;
            
            setTimeout(() => { ignoreClick = false; }, 200);
        });

        select.addEventListener("blur", function() {
            wrapper.classList.remove("active");
        });

        const handleEscape = (e) => {
            if (e.key === "Escape") {
                wrapper.classList.remove("active");
                select.blur();
            }
        };
        select.addEventListener("keydown", handleEscape);
        select.addEventListener("keyup", handleEscape);
    });
