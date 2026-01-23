// PLANAC - Header and Footer Components
// Versão 3.0 - Header e Footer Brancos

(function() {
    // ========== HEADER COMPONENT ==========
    const headerHTML = `
    <header class="main-header">
        <div class="header-container">
            <a href="/" class="logo">
                <img src="/images/logo/logo-planac.webp" alt="PLANAC Distribuidora" onerror="this.src='https://painel-planac.codiehost.com.br/uploads/133465395854612459.png'">
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
    
    <style>
        .main-header {
            background: #fff;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            padding: 10px 0;
        }
        
        .header-container {
            max-width: 1410px;
            width: 90%;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
        }
        
        .logo img {
            height: 50px;
            width: auto;
        }
        
        .main-nav {
            flex: 1;
        }
        
        .nav-menu {
            display: flex;
            list-style: none;
            gap: 25px;
            margin: 0;
            padding: 0;
            justify-content: center;
        }
        
        .nav-menu > li > a {
            color: #333;
            text-decoration: none;
            font-size: 1.5rem;
            font-weight: 500;
            padding: 10px 5px;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: color 0.3s;
        }
        
        .nav-menu > li > a:hover {
            color: #AA000E;
        }
        
        .arrow {
            font-size: 1rem;
        }
        
        .dropdown {
            position: relative;
        }
        
        .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            background: #fff;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            border-radius: 8px;
            padding: 10px 0;
            min-width: 220px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.3s;
            list-style: none;
        }
        
        .dropdown:hover .dropdown-menu {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .dropdown-menu li a {
            display: block;
            padding: 10px 20px;
            color: #333;
            text-decoration: none;
            font-size: 1.4rem;
            transition: all 0.2s;
        }
        
        .dropdown-menu li a:hover {
            background: #f5f5f5;
            color: #AA000E;
        }
        
        .header-contact .whatsapp-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #25D366;
            color: #fff;
            padding: 10px 20px;
            border-radius: 25px;
            text-decoration: none;
            font-size: 1.4rem;
            font-weight: 500;
            transition: all 0.3s;
        }
        
        .header-contact .whatsapp-btn:hover {
            background: #128C7E;
            transform: scale(1.05);
        }
        
        .mobile-menu-btn {
            display: none;
            flex-direction: column;
            gap: 5px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;
        }
        
        .mobile-menu-btn span {
            width: 25px;
            height: 3px;
            background: #333;
            border-radius: 2px;
            transition: all 0.3s;
        }
        
        /* Espaçamento para conteúdo após header fixo */
        body {
            padding-top: 75px;
        }
        
        @media (max-width: 992px) {
            .main-nav {
                position: fixed;
                top: 75px;
                left: -100%;
                width: 100%;
                height: calc(100vh - 75px);
                background: #fff;
                transition: left 0.3s;
                overflow-y: auto;
            }
            
            .main-nav.active {
                left: 0;
            }
            
            .nav-menu {
                flex-direction: column;
                padding: 20px;
                gap: 0;
            }
            
            .nav-menu > li > a {
                padding: 15px 10px;
                border-bottom: 1px solid #eee;
                font-size: 1.6rem;
            }
            
            .dropdown-menu {
                position: static;
                box-shadow: none;
                opacity: 1;
                visibility: visible;
                transform: none;
                padding-left: 20px;
                display: none;
            }
            
            .dropdown.active .dropdown-menu {
                display: block;
            }
            
            .mobile-menu-btn {
                display: flex;
            }
            
            .header-contact {
                display: none;
            }
        }
    </style>
    `;

    // ========== FOOTER COMPONENT ==========
    const footerHTML = `
    <footer class="main-footer">
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-col">
                    <img src="/images/logo/logo-planac.webp" alt="PLANAC" class="footer-logo" onerror="this.src='https://painel-planac.codiehost.com.br/uploads/133465395854612459.png'">
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
    
    <style>
        .main-footer {
            background: #fff;
            color: #333;
            padding: 60px 0 20px;
            border-top: 1px solid #eee;
        }
        
        .footer-container {
            max-width: 1410px;
            width: 90%;
            margin: 0 auto;
        }
        
        .footer-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 40px;
            margin-bottom: 40px;
        }
        
        .footer-logo {
            height: 50px;
            margin-bottom: 15px;
        }
        
        .footer-col p {
            font-size: 1.4rem;
            line-height: 1.6;
            color: #555;
        }
        
        .footer-col h4 {
            font-size: 1.6rem;
            margin-bottom: 15px;
            color: #AA000E;
        }
        
        .footer-col ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .footer-col ul li {
            margin-bottom: 8px;
        }
        
        .footer-col ul li a {
            color: #555;
            text-decoration: none;
            font-size: 1.4rem;
            transition: color 0.3s;
        }
        
        .footer-col ul li a:hover {
            color: #AA000E;
        }
        
        .footer-whatsapp {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #25D366;
            color: #fff;
            padding: 10px 20px;
            border-radius: 25px;
            text-decoration: none;
            font-size: 1.4rem;
            margin-top: 15px;
            transition: all 0.3s;
        }
        
        .footer-whatsapp:hover {
            background: #128C7E;
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        
        .footer-bottom p {
            font-size: 1.3rem;
            color: #888;
        }
        
        @media (max-width: 992px) {
            .footer-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 576px) {
            .footer-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
    `;

    // ========== WHATSAPP FLOAT BUTTON ==========
    const whatsappFloatHTML = `
    <a href="https://api.whatsapp.com/send/?phone=5543984182582" target="_blank" class="whatsapp-float">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
    
    <style>
        .whatsapp-float {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #25D366;
            color: #fff;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
            z-index: 999;
            transition: all 0.3s;
        }
        
        .whatsapp-float:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
        }
    </style>
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
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const mainNav = document.querySelector('.main-nav');
        
        if (mobileBtn && mainNav) {
            mobileBtn.addEventListener('click', function() {
                mainNav.classList.toggle('active');
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
    });
})();
