let kumpulanBab = {};

        // Fungsi otomatis membaca file esai.txt mentah kamu
        async function loadFileEsai() {
            try {
                const response = await fetch('esai.txt');
                const textData = await response.text();
                
                // Memotong isi file berdasarkan penanda [BAB X]
                const potongan = textData.split(/\[BAB\s*(\d+)\]/i);
                
                for (let i = 1; i < potongan.length; i += 2) {
                    const nomorBab = parseInt(potongan[i]);
                    const isiBab = potongan[i + 1].trim();
                    kumpulanBab[nomorBab] = isiBab;
                }
            } catch (err) {
                console.error("Gagal meload file esai mentah:", err);
            }
        }

        function bukaBab(nomorBab) {
            document.querySelectorAll('.view-section').forEach(view => view.classList.add('hidden'));
            
            if (nomorBab === 0) {
                document.getElementById('home-view').classList.remove('hidden');
            } else {
                let teksBab = kumpulanBab[nomorBab];
                if (teksBab) {
                    // JALUR SAKTI: Mengubah **teks** menjadi <strong>teks</strong> secara otomatis
                    let teksDenganBold = teksBab.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    
                    // Gunakan innerHTML (bukan innerText) agar tag <strong>-nya aktif dan terbaca oleh browser
                    document.getElementById('bab-konten-mentah').innerHTML = teksDenganBold;
                    
                    renderNavButtons(nomorBab);
                    document.getElementById('reader-view').classList.remove('hidden');
                }
            }
            
            window.scrollTo({top: 0, behavior: 'smooth'});
            updateNavWarna(nomorBab);
        }

        function renderNavButtons(nomorBab) {
            const container = document.getElementById('nav-action-buttons');
            let htmlTombol = '';
            
            if (nomorBab > 1) {
                htmlTombol += `<button onclick="bukaBab(${nomorBab - 1})" class="flex-1 md:flex-none text-center bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 rounded-xl text-sm cursor-pointer">&larr; Prev</button>`;
            }
            if (kumpulanBab[nomorBab + 1]) {
                htmlTombol += `<button onclick="bukaBab(${nomorBab + 1})" class="flex-1 md:flex-none text-center bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 rounded-xl text-sm font-medium cursor-pointer">Next &rarr;</button>`;
            } else {
                htmlTombol += `<button onclick="bukaBab(0)" class="flex-1 md:flex-none text-center bg-red-900 hover:bg-red-800 text-white px-5 py-3 rounded-xl text-sm font-medium cursor-pointer">Selesai Membaca</button>`;
            }
            container.innerHTML = htmlTombol;
        }

        function updateNavWarna(nomorBab) {
            const tombols = document.querySelectorAll('.nav-btn');
            tombols.forEach((btn, index) => {
                if(index === nomorBab) {
                    btn.classList.add('text-red-500');
                    btn.classList.remove('text-gray-400');
                } else {
                    btn.classList.remove('text-red-500');
                    btn.classList.add('text-gray-400');
                }
            });
        }

        // Load file teks saat web dibuka
        loadFileEsai();