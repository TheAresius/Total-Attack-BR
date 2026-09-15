const swalColors = {
    background: '#1f293a',
    color: '#ffffff',
    confirmButton: '#3085d6',
    cancelButton: '#d33',
    successButton: '#28a745'
};

function showAlert(title, text, icon = 'info') {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        background: swalColors.background,
        color: swalColors.color,
        confirmButtonColor: swalColors.confirmButton,
        confirmButtonText: 'OK'
    });
}

function askConfirm(title, text, onConfirm) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: swalColors.cancelButton,
        cancelButtonColor: swalColors.confirmButton,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar',
        background: swalColors.background,
        color: swalColors.color
    }).then((result) => {
        if (result.isConfirmed) {
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
        }
    });
}

function showToast(title, icon = 'success') {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: swalColors.background,
        color: swalColors.color,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    Toast.fire({
        icon: icon,
        title: title
    });
}

function askInput(title, currentValue, onConfirm, placeholderText) {
    Swal.fire({
        title: title,
        input: 'text',
        inputValue: currentValue,
        inputPlaceholder: placeholderText,
        showCancelButton: true,
        background: swalColors.background,
        color: swalColors.color,
        confirmButtonColor: swalColors.confirmButton,
        cancelButtonColor: swalColors.cancelButton,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Você precisa colocar um nome!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            if (typeof onConfirm === 'function') {
                onConfirm(result.value);
            }
        }
    });
}

function openLivePix() {
    Swal.fire({
        title: '<span style="color: #fff; font-size: 1.4rem;">Apoie o Projeto</span>',
        html: `
            <div class="livepix-flex-container">
                <div class="livepix-frame-box">
                    <iframe 
                        class="livepix-iframe-fix"
                        src="https://widget.livepix.gg/embed/8b046f08-6752-4ceb-ad15-5c54107266cc" 
                        scrolling="no">
                    </iframe>
                </div>
                
                <div class="livepix-text-side">
                    <p style="margin-bottom: 15px; font-size: 1.1em; font-weight: bold; color: #fff;">
                        Sua ajuda faz a diferença!
                    </p>
                    <p>
                        A calculadora <b>é</b> e <b>sempre será gratuita</b>. Mas se quiser contribuir, sua ajuda será muito bem vinda!
                    </p>
                    <div style="background: rgba(93, 173, 226, 0.1); padding: 10px; border-radius: 6px; margin-top: 10px; border-left: 3px solid #5DADE2;">
                        <small style="color: #ccc;">Use o leitor da câmera / QR Code do celular (e não o do aplicativo do banco).</small>
                    </div>
                </div>
            </div>
        `,
        customClass: {
            htmlContainer: 'fix-livepix-spacing'
        },
        showConfirmButton: false,
        showCloseButton: true,
        width: 700,
        background: '#1f293a',
        backdrop: `rgba(0,0,0,0.7)`
    });
}