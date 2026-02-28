 document.getElementById("yr").textContent = new Date().getFullYear();

      // LGPD
      function lgpdOk() {
        document.getElementById("lgpd").style.display = "none";
        localStorage.setItem("lgpd", "ok");
        gtag("config", "G-XXXXXXXXXX", { send_page_view: true });
      }
      function lgpdNo() {
        document.getElementById("lgpd").style.display = "none";
        localStorage.setItem("lgpd", "no");
      }
      (function () {
        const c = localStorage.getItem("lgpd");
        if (c === "ok") {
          document.getElementById("lgpd").style.display = "none";
          gtag("config", "G-XXXXXXXXXX", { send_page_view: true });
        } else if (c === "no") {
          document.getElementById("lgpd").style.display = "none";
        }
      })();

      // Nav scroll
      window.addEventListener(
        "scroll",
        () => {
          document.getElementById("nav").classList.toggle("sc", scrollY > 40);
        },
        { passive: true },
      );

      // Hamburger
      const ham = document.getElementById("ham"),
        nmob = document.getElementById("nmob");
      ham.addEventListener("click", () => {
        const o = nmob.classList.toggle("open");
        ham.classList.toggle("open");
        ham.setAttribute("aria-expanded", o);
        document.body.style.overflow = o ? "hidden" : "";
      });
      document.getElementById("nmc").addEventListener("click", () => {
        nmob.classList.remove("open");
        ham.classList.remove("open");
        document.body.style.overflow = "";
      });
      document.querySelectorAll(".ml").forEach((l) =>
        l.addEventListener("click", () => {
          nmob.classList.remove("open");
          ham.classList.remove("open");
          document.body.style.overflow = "";
        }),
      );

      // Status horário
      function checkSt() {
        const n = new Date(),
          d = n.getDay(),
          t = n.getHours() * 60 + n.getMinutes();
        let open = false,
          next = "";
        if (d === 1) {
          open = t >= 720 && t < 1200;
          next = open
            ? "Fecha às 20h"
            : t < 720
              ? "Abre às 12h"
              : "Amanhã às 08h";
        } else if (d >= 2 && d <= 6) {
          open = t >= 480 && t < 1200;
          next = open
            ? "Fecha às 20h"
            : t < 480
              ? "Abre às 08h"
              : d < 6
                ? "Amanhã às 08h"
                : "Seg às 12h";
        } else {
          open = false;
          next = "Abre segunda às 12h";
        }
        const dc = open ? "open" : "closed";
        document.getElementById("sbDot").className = "sdot " + dc;
        document.getElementById("sbTxt").textContent =
          (open ? "Estamos abertos! " : "Fechado agora. ") + next;
        document.getElementById("hDot").className =
          "pdot " + (open ? "opn" : "cls");
        document.getElementById("hSt").textContent = open
          ? "Aberto · Agende agora"
          : "Fechado · " + next;
        document.getElementById("wDot").className = "wsd " + dc;
        document.getElementById("wTxt").textContent = open
          ? "Agendar horário"
          : "Fale comigo e agende seu horario";
        if (!open)
          document.getElementById("wBtn").href =
            "https://wa.me/554398821-3974?text=Olá!%20Estou%20entrando%20em%20contato%20fora%20do%20horário.%20Gostaria%20de%20agendar%20quando%20disponível!%20🌸";
      }
      checkSt();
      setInterval(checkSt, 60000);

      // Lazy load vídeos via IntersectionObserver (src só é atribuído quando entra na viewport)
      const vidObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const vid = e.target.querySelector("video");
              if (vid && vid.dataset.src && !vid.src) {
                vid.querySelector("source").src = vid.dataset.src;
                vid.load();
              }
              vidObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1 },
      );
      document.querySelectorAll(".cv").forEach((cv) => vidObs.observe(cv));

      // Carrossel
      (function () {
        const track = document.getElementById("cT"),
          items = [...track.children];
        const dotsW = document.getElementById("cDots");
        let cur = 0;
        const vis = () =>
          window.innerWidth <= 560 ? 1 : window.innerWidth <= 920 ? 2 : 3;
        const total = () => Math.ceil(items.length / vis());
        function buildDots() {
          dotsW.innerHTML = "";
          for (let i = 0; i < total(); i++) {
            const d = document.createElement("div");
            d.className = "cd" + (i === cur ? " on" : "");
            d.addEventListener("click", () => goTo(i));
            dotsW.appendChild(d);
          }
        }
        function goTo(idx) {
          cur = Math.max(0, Math.min(idx, total() - 1));
          track.style.transform = `translateX(-${cur * ((items[0].offsetWidth + 16) * vis())}px)`;
          dotsW
            .querySelectorAll(".cd")
            .forEach((d, i) => d.classList.toggle("on", i === cur));
        }
        document
          .getElementById("cPrev")
          .addEventListener("click", () => goTo(cur - 1));
        document
          .getElementById("cNext")
          .addEventListener("click", () => goTo(cur + 1));
        buildDots();
        window.addEventListener("resize", () => {
          buildDots();
          goTo(0);
        });
        let auto = setInterval(
          () => goTo(cur + 1 < total() ? cur + 1 : 0),
          4200,
        );
        track.addEventListener("mouseenter", () => clearInterval(auto));
        track.addEventListener("mouseleave", () => {
          auto = setInterval(() => goTo(cur + 1 < total() ? cur + 1 : 0), 4200);
        });
        let sx = 0;
        track.addEventListener(
          "touchstart",
          (e) => {
            sx = e.touches[0].clientX;
          },
          { passive: true },
        );
        track.addEventListener("touchend", (e) => {
          if (Math.abs(sx - e.changedTouches[0].clientX) > 45)
            goTo(sx > e.changedTouches[0].clientX ? cur + 1 : cur - 1);
        });
        document.querySelectorAll(".cv").forEach((cv) => {
          const v = cv.querySelector("video");
          cv.addEventListener("mouseenter", () => {
            if (v.readyState >= 2) v.play();
          });
          cv.addEventListener("mouseleave", () => {
            v.pause();
            v.currentTime = 0;
          });
        });
      })();

      // Lightbox
      const lb = document.getElementById("lb"),
        lbI = document.getElementById("lbI"),
        lbV = document.getElementById("lbV");
      document.querySelectorAll(".ci").forEach((c) => {
        c.addEventListener("click", () => {
          lbI.src = c.querySelector("img").src;
          lbI.alt = c.dataset.lbl || "";
          lbI.style.display = "block";
          lbV.style.display = "none";
          lbV.pause();
          lb.classList.add("on");
          document.body.style.overflow = "hidden";
        });
      });
      document.querySelectorAll(".cv").forEach((cv) => {
        cv.addEventListener("click", () => {
          const v = cv.querySelector("video");
          lbV.src = v.dataset.src || v.currentSrc;
          lbV.style.display = "block";
          lbI.style.display = "none";
          lb.classList.add("on");
          document.body.style.overflow = "hidden";
          lbV.play();
        });
      });
      function closeLb() {
        lb.classList.remove("on");
        document.body.style.overflow = "";
        lbV.pause();
        lbV.src = "";
        lbI.src = "";
      }
      document.getElementById("lbc").addEventListener("click", closeLb);
      lb.addEventListener("click", (e) => {
        if (e.target === lb) closeLb();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLb();
      });

      // Scroll reveal
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e, i) => {
            if (e.isIntersecting) {
              setTimeout(() => e.target.classList.add("vis"), i * 70);
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1 },
      );

      document.querySelectorAll(".rev").forEach((el) => obs.observe(el));
