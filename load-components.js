// PLANAC - Header and Footer Components
// Versão 4.0 - CSS no HTML (evita pisca-pisca)

(function() {
    // ========== HEADER COMPONENT ==========
    const headerHTML = `
    <header class="main-header">
        <div class="header-container">
            <a href="/" class="logo">
                <img src="/images/logo/logo-planac.svg" alt="PLANAC Distribuidora">
            </a>
            
            <nav class="main-nav">
                <ul class="nav-menu">
                    <li><a href="/">Início</a></li>
                    <li class="dropdown">
                        <a href="/#forros">Forros <span class="arrow">▼</span></a>
                        <ul class="dropdown-menu">
                            <li><a href="/servicos/forro-de-gesso-acartonado/">Gesso Acartonado</a></li>
                            <li><a href="/servicos/gesso-modular/">Gesso Modular</a></li>
                            <li><a href="/servicos/pvc-branco/">PVC Branco</a></li>
                            <li><a href="/servicos/pvc-amadeirado/">PVC Amadeirado</a></li>
                            <li><a href="/servicos/pvc-modular/">PVC Modular</a></li>
                            <li><a href="/servicos/forro-vinilico-revid/">Forro Vinílico REVID</a></li>
                            <li><a href="/servicos/forrovid/">Forrovid</a></li>
                            <li><a href="/servicos/mineral/">Mineral</a></li>
                            <li><a href="/servicos/isopor/">Isopor</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="/#divisorias">Divisórias <span class="arrow">▼</span></a>
                        <ul class="dropdown-menu">
                            <li><a href="/servicos/parede-de-gesso-acartonado-drywall/">Drywall</a></li>
                            <li><a href="/servicos/divisoria-naval/">Divisória Naval</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="/#isolamento">Isolamento <span class="arrow">▼</span></a>
                        <ul class="dropdown-menu">
                            <li><a href="/servicos/la-de-vidro/">Lã de Vidro</a></li>
                            <li><a href="/servicos/la-de-rocha/">Lã de Rocha</a></li>
                            <li><a href="/servicos/la-de-pet/">Lã de PET</a></li>
                            <li><a href="/servicos/manta-termica-aluminizada/">Manta Térmica</a></li>
                        </ul>
                    </li>
                    <li><a href="/#sobre">Sobre</a></li>
                    <li><a href="/#contato">Contato</a></li>
                </ul>
            </nav>
            
            <div class="header-contact">
                <a href="https://api.whatsapp.com/send/?phone=5543984182582" target="_blank" class="whatsapp-btn">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                </a>
            </div>
            
            <button class="mobile-menu-btn" aria-label="Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </header>
    `;

    // ========== FOOTER COMPONENT ==========
    const footerHTML = `
    <footer class="main-footer">
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-col">
                    <img src="/images/logo/logo-planac.svg" alt="PLANAC" class="footer-logo">
                    <p>Distribuidor autorizado de materiais para construção civil. Qualidade e confiança desde 2011.</p>
                </div>
                
                <div class="footer-col">
                    <h4>Forros</h4>
                    <ul>
                        <li><a href="/servicos/forro-de-gesso-acartonado/">Gesso Acartonado</a></li>
                        <li><a href="/servicos/gesso-modular/">Gesso Modular</a></li>
                        <li><a href="/servicos/pvc-branco/">PVC Branco</a></li>
                        <li><a href="/servicos/pvc-amadeirado/">PVC Amadeirado</a></li>
                        <li><a href="/servicos/forro-vinilico-revid/">Forro Vinílico</a></li>
                        <li><a href="/servicos/forrovid/">Forrovid</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>Divisórias</h4>
                    <ul>
                        <li><a href="/servicos/parede-de-gesso-acartonado-drywall/">Drywall</a></li>
                        <li><a href="/servicos/divisoria-naval/">Divisória Naval</a></li>
                    </ul>
                    <h4 style="margin-top: 20px;">Isolamento</h4>
                    <ul>
                        <li><a href="/servicos/la-de-vidro/">Lã de Vidro</a></li>
                        <li><a href="/servicos/la-de-rocha/">Lã de Rocha</a></li>
                        <li><a href="/servicos/manta-termica-aluminizada/">Manta Térmica</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>Contato</h4>
                    <p><strong>📍 Endereço:</strong><br>Av. Abélio Benatti, 4912<br>Jardim do Sol - Londrina/PR</p>
                    <p><strong>📞 Telefone:</strong><br>(43) 98418-2582</p>
                    <p><strong>🕐 Horário:</strong><br>Segunda a Sexta: 8h às 17h</p>
                    <a href="https://api.whatsapp.com/send/?phone=5543984182582" target="_blank" class="footer-whatsapp">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                    </a>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>© 2024 PLANAC Distribuidora. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
    `;

    // ========== WHATSAPP FLOAT BUTTON ==========
    const whatsappFloatHTML = `
    <a href="https://api.whatsapp.com/send/?phone=5543984182582" target="_blank" class="whatsapp-float">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
    `;

    // ========== INJECT COMPONENTS ==========
    document.addEventListener('DOMContentLoaded', function() {
        // Header
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            headerContainer.innerHTML = headerHTML;
        }
        
        // Footer
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = footerHTML;
        }
        
        // WhatsApp Float
        const whatsappContainer = document.getElementById('whatsapp-float-container');
        if (whatsappContainer) {
            whatsappContainer.innerHTML = whatsappFloatHTML;
        }
        
        // Mobile menu toggle
        setTimeout(function() {
            const mobileBtn = document.querySelector('.mobile-menu-btn');
            const mainNav = document.querySelector('.main-nav');
            
            if (mobileBtn && mainNav) {
                mobileBtn.addEventListener('click', function() {
                    mainNav.classList.toggle('active');
                    this.classList.toggle('active');
                });
            }
            
            // Dropdown toggle on mobile
            const dropdowns = document.querySelectorAll('.dropdown > a');
            dropdowns.forEach(function(dropdown) {
                dropdown.addEventListener('click', function(e) {
                    if (window.innerWidth <= 992) {
                        e.preventDefault();
                        this.parentElement.classList.toggle('active');
                    }
                });
            });
        }, 100);
    });
})();
