document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        var modal = document.getElementById('modal');
        
        if (modal && modal.style.display === 'block') {
            closeCompareModal();
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var overlay = document.getElementById('overlay');
    
    if (overlay) {
        overlay.addEventListener('click', function(event) {
            var modal = document.getElementById('modal');
            
            if (modal && modal.style.display === 'block') {
                closeCompareModal();
            }
        });
    }
});

window.closeCompareModal = function() {
    var modal = document.getElementById('modal');
    var modalContent = modal.querySelector('.modal-content');
    var overlay = document.getElementById('overlay');
    
    if (modalContent) modalContent.classList.remove('show');
    
    setTimeout(function() {
        if (modal) modal.style.display = 'none';
        if (overlay) overlay.classList.remove('show');
        document.body.classList.remove('no-scroll');
    }, 200);
};