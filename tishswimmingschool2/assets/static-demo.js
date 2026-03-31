/**
 * Static Demo Interactivity
 * Replaces WooCommerce AJAX, forms, chatbot, and search with local localStorage-based functionality.
 */
(function() {
    'use strict';

    // ========== CART (localStorage) ==========
    function getCart() {
        try { return JSON.parse(localStorage.getItem('demo_cart') || '[]'); }
        catch(e) { return []; }
    }
    function saveCart(cart) {
        localStorage.setItem('demo_cart', JSON.stringify(cart));
        updateCartCount();
        updateCartPopup();
    }
    function getCartCount() {
        return getCart().reduce(function(sum, item) { return sum + item.qty; }, 0);
    }
    function updateCartCount() {
        var count = getCartCount();
        document.querySelectorAll('.cart-items-count').forEach(function(el) {
            el.textContent = count;
        });
    }
    function updateCartPopup() {
        var cart = getCart();
        var popups = document.querySelectorAll('.widget_shopping_cart_content');
        popups.forEach(function(popup) {
            if (cart.length === 0) {
                popup.innerHTML = '<p class="woocommerce-mini-cart__empty-message" style="padding:15px;text-align:center;">No products in the cart.</p>';
            } else {
                var html = '<ul class="woocommerce-mini-cart cart_list product_list_widget" style="list-style:none;padding:10px;margin:0;">';
                var total = 0;
                cart.forEach(function(item, idx) {
                    var itemTotal = item.price * item.qty;
                    total += itemTotal;
                    html += '<li class="woocommerce-mini-cart-item mini_cart_item" style="padding:8px 0;border-bottom:1px solid #eee;display:flex;align-items:center;gap:8px;">';
                    html += '<a href="#" class="remove remove_from_cart_button" data-cart-idx="' + idx + '" style="color:#e00;text-decoration:none;font-weight:bold;font-size:18px;">&times;</a>';
                    if (item.image) html += '<img src="' + item.image + '" style="width:40px;height:40px;object-fit:cover;border-radius:3px;" alt="">';
                    html += '<span style="flex:1;">' + item.name + ' &times; ' + item.qty + '</span>';
                    html += '<span>$' + itemTotal.toFixed(2) + '</span>';
                    html += '</li>';
                });
                html += '</ul>';
                html += '<p class="woocommerce-mini-cart__total total" style="padding:10px;margin:0;font-weight:bold;border-top:2px solid #eee;">Subtotal: <span class="amount">$' + total.toFixed(2) + '</span></p>';
                html += '<p class="woocommerce-mini-cart__buttons buttons" style="padding:10px;margin:0;display:flex;gap:8px;">';
                html += '<a class="button wc-forward" href="#" onclick="localStorage.removeItem(\'demo_cart\');location.reload();return false;" style="flex:1;text-align:center;padding:8px;background:#e00;color:#fff;text-decoration:none;border-radius:3px;font-size:13px;">Clear Cart</a>';
                html += '</p>';
                popup.innerHTML = html;

                // Bind remove buttons
                popup.querySelectorAll('.remove_from_cart_button').forEach(function(btn) {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        var idx = parseInt(this.getAttribute('data-cart-idx'));
                        var c = getCart();
                        c.splice(idx, 1);
                        saveCart(c);
                    });
                });
            }
        });
    }

    function addToCart(productId, productName, price, image) {
        var cart = getCart();
        var found = false;
        cart.forEach(function(item) {
            if (item.id === productId) {
                item.qty++;
                found = true;
            }
        });
        if (!found) {
            cart.push({ id: productId, name: productName, price: price, qty: 1, image: image || '' });
        }
        saveCart(cart);
        showNotification('"' + productName + '" has been added to your cart.');
    }

    function showNotification(message) {
        var existing = document.getElementById('static-demo-notification');
        if (existing) existing.remove();

        var div = document.createElement('div');
        div.id = 'static-demo-notification';
        div.style.cssText = 'position:fixed;top:20px;right:20px;z-index:999999;background:#4CAF50;color:#fff;padding:15px 25px;border-radius:6px;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.3);transition:opacity 0.5s;max-width:350px;';
        div.textContent = message;
        document.body.appendChild(div);
        setTimeout(function() {
            div.style.opacity = '0';
            setTimeout(function() { div.remove(); }, 500);
        }, 3000);
    }

    // ========== SEARCH (local) ==========
    // Build a simple page index for search
    var pageIndex = [
        { title: 'Home', url: 'index.html' },
        { title: 'Blog', url: 'blog/index.html' },
        { title: 'Shop', url: 'shop/index.html' },
        { title: 'About', url: 'about/index.html' },
        { title: 'Contacts', url: 'contacts/index.html' },
        { title: 'Automatic Slider', url: 'automatic-slider/index.html' },
        { title: 'Image Flow Gallery', url: 'image-flow-gallery/index.html' },
        { title: 'Simple Image Carousel', url: 'simple-image-carousel/index.html' },
        { title: 'Partial Image Overlay', url: 'partial-image-overlay/index.html' },
        { title: 'Product 1', url: 'product/product-1/index.html' },
        { title: 'Product 2', url: 'product/product-2/index.html' },
        { title: 'Product 3', url: 'product/product-3/index.html' },
        { title: 'Product 4', url: 'product/product-4/index.html' },
        { title: 'Product 5', url: 'product/product-5/index.html' },
        { title: 'Product 6', url: 'product/product-6/index.html' },
        { title: 'Product 7', url: 'product/product-7/index.html' },
        { title: 'Product 8', url: 'product/product-8/index.html' },
        { title: 'Accessories', url: 'product-category/accessories/index.html' },
        { title: 'Best Sellers', url: 'product-category/best-sellers/index.html' },
        { title: 'Electronics', url: 'product-category/electronics/index.html' },
        { title: 'Essentials', url: 'product-category/essentials/index.html' },
        { title: 'Featured', url: 'product-category/featured/index.html' },
        { title: 'Trending', url: 'product-category/trending/index.html' },
        { title: 'Cross Platform Style Guide', url: 'project/cross-platform-style-guide/index.html' },
        { title: 'UX Audit Optimization Plan', url: 'project/ux-audit-optimization-plan/index.html' },
        { title: 'Brand Storytelling Video Series', url: 'project/brand-storytelling-video-series/index.html' },
        { title: 'AI-Powered Chatbot Integration', url: 'project/ai-powered-chatbot-integration/index.html' },
        { title: 'Startup Landing Page Build', url: 'project/startup-landing-page-build/index.html' },
        { title: 'Corporate Rebranding Package', url: 'project/corporate-rebranding-package/index.html' },
        { title: 'Simple Ways to Improve Workflow Today', url: '2025/04/02/simple-ways-to-improve-workflow-today/index.html' },
        { title: 'How One Team Boosted Results in 3 Months', url: '2025/04/01/how-one-team-boosted-results-in-3-months/index.html' },
        { title: 'Beginners Guide to Organizing Your Week', url: '2025/03/11/beginners-guide-to-organizing-your-week/index.html' },
        { title: 'Top Shortcuts That Save You Hours Weekly', url: '2025/02/12/top-shortcuts-that-save-you-hours-weekly/index.html' },
        { title: 'Lessons Learned from Everyday Challenges', url: '2025/01/01/lessons-learned-from-everyday-challenges/index.html' },
    ];

    function getBaseUrl() {
        // Find depth from root by counting path segments
        var path = window.location.pathname;
        var parts = path.split('/').filter(function(p) { return p && p !== 'index.html'; });
        var depth = parts.length;
        // If we're at the root alphana folder
        var prefix = '';
        for (var i = 0; i < depth; i++) prefix += '../';
        return prefix || './';
    }

    function handleSearch(query) {
        if (!query || !query.trim()) return;
        query = query.trim().toLowerCase();
        var base = getBaseUrl();
        var results = pageIndex.filter(function(p) {
            return p.title.toLowerCase().indexOf(query) !== -1;
        });

        if (results.length === 1) {
            window.location.href = base + results[0].url;
        } else if (results.length > 0) {
            var msg = 'Search results for "' + query + '":\n\n';
            results.forEach(function(r, i) { msg += (i+1) + '. ' + r.title + '\n'; });
            alert(msg);
            window.location.href = base + results[0].url;
        } else {
            showNotification('No results found for "' + query + '".');
        }
    }

    // ========== INIT ON DOM READY ==========
    function init() {
        // --- Update cart count on load ---
        updateCartCount();
        updateCartPopup();

        // --- Fix search forms ---
        document.querySelectorAll('form').forEach(function(form) {
            var action = form.getAttribute('action') || '';
            var sInput = form.querySelector('input[name="s"]');
            if (sInput) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    handleSearch(sInput.value);
                });
                form.setAttribute('action', '#');
            }
        });

        // --- Fix Add to Cart (AJAX buttons on shop/listing pages) ---
        document.querySelectorAll('.add_to_cart_button, .ajax_add_to_cart').forEach(function(btn) {
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var name = this.getAttribute('aria-label') || '';
                name = name.replace(/^Add to cart:\s*/, '').replace(/["\u201c\u201d]/g, '');
                var id = this.getAttribute('data-product_id') || Math.random().toString();
                // Try to find price and image nearby
                var container = this.closest('.product, .wc-block-grid__product, li');
                var price = 0;
                var image = '';
                if (container) {
                    var priceEl = container.querySelector('.woocommerce-Price-amount, .price .amount');
                    if (priceEl) {
                        var priceText = priceEl.textContent.replace(/[^0-9.]/g, '');
                        price = parseFloat(priceText) || 0;
                    }
                    var imgEl = container.querySelector('img');
                    if (imgEl) image = imgEl.getAttribute('src') || '';
                }
                addToCart(id, name || 'Product', price, image);
                this.classList.add('added');
            });
        });

        // --- Fix single product Add to Cart form ---
        document.querySelectorAll('form.cart').forEach(function(form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                var btn = form.querySelector('.single_add_to_cart_button');
                var nameEl = document.querySelector('.product_title, .entry-title, h1');
                var name = nameEl ? nameEl.textContent.trim() : 'Product';
                var id = btn ? btn.getAttribute('value') || btn.getAttribute('name') : Math.random().toString();
                var priceEl = document.querySelector('.summary .woocommerce-Price-amount, .price .amount');
                var price = 0;
                if (priceEl) {
                    price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) || 0;
                }
                var imgEl = document.querySelector('.woocommerce-product-gallery img, .product .wp-post-image');
                var image = imgEl ? imgEl.getAttribute('src') || '' : '';
                var qty = form.querySelector('input[name="quantity"]');
                var quantity = qty ? parseInt(qty.value) || 1 : 1;
                for (var i = 0; i < quantity; i++) {
                    addToCart(id, name, price, image);
                }
            });
        });

        // --- Fix cart icon link ---
        document.querySelectorAll('.cart-contents-icon, a[title="View your shopping cart"]').forEach(function(el) {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                // Toggle cart popup visibility
                var popup = this.closest('li') ? this.closest('li').querySelector('#cart-popup-content') : null;
                if (!popup) popup = document.getElementById('cart-popup-content');
                if (popup) {
                    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
                }
            });
            el.setAttribute('href', '#');
        });

        // --- Fix contact form ---
        document.querySelectorAll('#contact-form').forEach(function(form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('Thank you! Your message has been received. (This is a demo site)');
                form.reset();
            });
        });

        // --- Fix newsletter form ---
        document.querySelectorAll('#newsletter-form').forEach(function(form) {
            form.removeAttribute('target');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('Thank you for subscribing! (This is a demo site)');
                form.reset();
                var dialog = document.getElementById('newsletter-dialog');
                if (dialog) dialog.style.display = 'none';
                localStorage.setItem('newsletter_closed', 'true');
            });
        });

        // --- Fix comment / review forms ---
        document.querySelectorAll('#commentform, #review_form form, form.comment-form').forEach(function(form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('Thank you for your comment! (This is a demo site)');
                form.reset();
            });
        });

        // --- Fix chatbot ---
        var chatWindow = document.getElementById('tishonator-chatbot-window');
        var chatMessages = chatWindow ? chatWindow.querySelector('.tishonator-chatbot-messages') : null;
        var chatInput = chatWindow ? chatWindow.querySelector('input[type="text"], textarea') : null;
        var chatForm = chatWindow ? chatWindow.querySelector('form') : null;
        if (chatForm && chatInput && chatMessages) {
            chatForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var msg = chatInput.value.trim();
                if (!msg) return;

                // Add user message
                var userDiv = document.createElement('div');
                userDiv.className = 'tishonator-chatbot-message tishonator-chatbot-message-user';
                userDiv.innerHTML = '<div class="tishonator-chatbot-message-content">' + escapeHtml(msg) + '</div>';
                chatMessages.appendChild(userDiv);
                chatInput.value = '';

                // Add bot response
                setTimeout(function() {
                    var botDiv = document.createElement('div');
                    botDiv.className = 'tishonator-chatbot-message tishonator-chatbot-message-bot';
                    botDiv.innerHTML = '<div class="tishonator-chatbot-message-content">Thanks for your message! This is a static demo — the AI assistant is not available in this version. Please visit the live site for full chatbot functionality.</div>';
                    chatMessages.appendChild(botDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 500);
            });
        }

        // --- Kill any remaining WooCommerce AJAX calls ---
        if (window.jQuery) {
            var $ = window.jQuery;
            $(document).on('click', '.add_to_cart_button', function(e) {
                e.stopImmediatePropagation();
            });
        }
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
