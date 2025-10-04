<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Данные разработчиков
const developers = ref([
  {
    id: 1,
    name: 'Далиба Богдан',
    role: 'Frontend Developer',
    description:
      'Мастер пользовательского опыта и современного фронтенда. Создает интуитивные интерфейсы и оптимизирует производительность веб-приложений.',
    skills: ['Vue.js', 'Nuxt.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'JS', 'CSS'],
    gradient: 'from-blue-500 to-purple-600',
    avatar: '/images/avatars/bogdan.webp',
    github: 'https://github.com/Hahora',
    initials: 'БД',
  },
  {
    id: 2,
    name: 'Буренок Андрей',
    role: 'Backend Developer',
    description:
      'Опытный бэкенд-разработчик с глубоким пониманием архитектуры серверной части, построения API и интеграции с внешними системами. Уверенно работает с базами данных. Обеспечивая стабильную и масштабируемую работу backend-части проекта.',
    skills: ['Python', 'FastAPI', 'Flask', 'SQLAlchemy', 'PostgreSQL', 'Docker', 'ML'],
    gradient: 'from-emerald-500 to-teal-600',
    avatar: '/images/avatars/andrey.webp',
    github: 'https://github.com/GECOCIXE',
    initials: 'АБ',
  },
  {
    id: 3,
    name: 'Алипатов Иван',
    role: 'Machine Learning Developer',
    description:
      'Специалист по машинному обучению с упором на продакшн-решения. Разрабатывает и внедряет ML-модели, оптимизируя их для высокой производительности и масштабируемости. Уверенно работает с бэкендом и ML-инфраструктурой.',
    skills: [
      'Python',
      'PyTorch',
      'TensorFlow',
      'FastAPI',
      'Docker',
      'MLflow',
      'Pandas',
      'NumPy',
      'PostgreSQL',
      'Kubernetes',
    ],
    gradient: 'from-red-500 to-teal-600',
    avatar: '/images/avatars/ivan.webp',
    github: 'https://github.com/tvivan',
    initials: 'ИА',
  },
  {
    id: 4,
    name: 'Бражко Денис',
    role: 'Machine Learning Developer',
    description:
      'Руководитель команды машинного обучения с опытом построения end-to-end ML-пайплайнов и выведения моделей в прод. Организует процесс разработки, менторит разработчиков.',
    skills: [
      'Python',
      'ML system design',
      'Airflow',
      'MLflow',
      'Kubernetes',
      'Docker',
      'CI/CD',
      'Leadership',
      'MLOps',
      'Data Engineering',
      'Model Deployment',
    ],
    gradient: 'from-yellow-500 to-teal-600',
    avatar: '/images/avatars/denis.webp',
    github: 'https://github.com/T1nnLD',
    initials: 'ДБ',
  },
  {
    id: 5,
    name: 'Орлова Елизавета',
    role: 'Аналитик',
    description:
      'Аналитик с острым взглядом на данные и сердцем для решений. Она превращает хаос в стратегию, а цифры в историю. В команде хакатона — её интеллект, чёткость и умение видеть за пределами экрана делают разницу.',
    skills: ['Python & Data Engineering', 'ML System Design & MLOps', ' Team Alignment'],
    gradient: 'from-blue-500 to-teal-600',
    avatar: '/images/avatars/Liza.webp',
    github: '',
    initials: 'ЕО',
  },
])

// Анимации при скролле и параллакс
const isVisible = ref(false)
const scrollY = ref(0)
const mouseX = ref(0)
const mouseY = ref(0)
const isMouseMoving = ref(false)

const handleScroll = () => {
  scrollY.value = window.scrollY
}

const handleMouseMove = (event) => {
  mouseX.value = (event.clientX / window.innerWidth - 0.5) * 2
  mouseY.value = (event.clientY / window.innerHeight - 0.5) * 2
  isMouseMoving.value = true

  // Сброс флага движения мыши через некоторое время
  clearTimeout(window.mouseTimeout)
  window.mouseTimeout = setTimeout(() => {
    isMouseMoving.value = false
  }, 100)
}

onMounted(() => {
  // Intersection Observer для анимаций
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    },
    { threshold: 0.1 },
  )

  const elements = document.querySelectorAll('.animate-on-scroll')
  elements.forEach((el) => observer.observe(el))

  // События
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('mousemove', handleMouseMove)
  clearTimeout(window.mouseTimeout)
})
</script>

<template>
  <div class="min-h-screen relative overflow-hidden bg-black perspective-1000">
    <!-- Космический фон с 3D параллакс эффектом -->
    <div class="fixed inset-0 overflow-hidden">
      <!-- Звездное поле - дальний слой с 3D эффектом -->
      <div
        class="absolute inset-0 opacity-80 transition-transform duration-75 ease-out"
        :style="{
          transform: `translateY(${scrollY * 0.1}px) translateX(${
            mouseX * 10
          }px) translateZ(${mouseY * 5}px) rotateX(${mouseY * 2}deg) rotateY(${mouseX * 2}deg)`,
        }"
      >
        <div class="stars-layer-1"></div>
      </div>

      <!-- Средний слой звезд с более сильным 3D эффектом -->
      <div
        class="absolute inset-0 opacity-60 transition-transform duration-75 ease-out"
        :style="{
          transform: `translateY(${scrollY * 0.2}px) translateX(${
            mouseX * 20
          }px) translateZ(${mouseY * 10}px) rotateX(${mouseY * 4}deg) rotateY(${mouseX * 4}deg)`,
        }"
      >
        <div class="stars-layer-2"></div>
      </div>

      <!-- Быстро движущиеся звезды для эффекта полета -->
      <div
        class="absolute inset-0 opacity-40"
        :style="{
          transform: `translateY(${scrollY * 0.5}px) translateX(${
            mouseX * 50
          }px) translateZ(${mouseY * 25}px)`,
        }"
      >
        <div class="speed-stars"></div>
      </div>

      <!-- Туманности и космические облака с 3D эффектом -->
      <div
        class="absolute inset-0 transition-transform duration-100 ease-out"
        :style="{
          transform: `translateY(${scrollY * 0.15}px) translateX(${
            mouseX * 30
          }px) translateZ(${mouseY * 15}px) rotateX(${mouseY * 3}deg) rotateY(${mouseX * 3}deg)`,
        }"
      >
        <!-- Большая туманность -->
        <div
          class="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow hover-glow"
        ></div>
        <div
          class="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-tr from-blue-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow animation-delay-3000 hover-glow"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-emerald-500/10 via-teal-500/15 to-transparent rounded-full blur-3xl animate-pulse-slow animation-delay-6000 hover-glow"
        ></div>
      </div>

      <!-- Планеты и космические объекты с сильным 3D эффектом -->
      <div
        class="absolute inset-0 transition-transform duration-100 ease-out"
        :style="{
          transform: `translateY(${scrollY * 0.3}px) translateX(${
            mouseX * 40
          }px) translateZ(${mouseY * 20}px) rotateX(${mouseY * 5}deg) rotateY(${mouseX * 5}deg)`,
        }"
      >
        <!-- Большая планета -->
        <div
          class="absolute top-16 right-32 w-32 h-32 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-600/20 shadow-2xl border border-purple-300/20 hover-planet"
        ></div>
        <!-- Малая планета -->
        <div
          class="absolute bottom-40 left-16 w-20 h-20 rounded-full bg-gradient-to-br from-blue-400/25 to-cyan-600/15 shadow-xl border border-blue-300/15 hover-planet"
        ></div>
        <!-- Кольцевая планета -->
        <div
          class="absolute top-1/3 left-3/4 w-24 h-24 rounded-full bg-gradient-to-br from-orange-400/20 to-red-600/10 shadow-xl relative hover-planet"
        >
          <div
            class="absolute inset-0 rounded-full border-2 border-orange-300/30 scale-150 animate-spin-slow"
          ></div>
        </div>
      </div>

      <!-- Передний слой частиц с максимальным 3D эффектом -->
      <div
        class="absolute inset-0 transition-transform duration-75 ease-out"
        :style="{
          transform: `translateY(${scrollY * 0.4}px) translateX(${
            mouseX * 60
          }px) translateZ(${mouseY * 30}px) rotateX(${mouseY * 6}deg) rotateY(${mouseX * 6}deg)`,
        }"
      >
        <div class="floating-particles"></div>
      </div>

      <!-- Дополнительные космические эффекты -->
      <div
        class="absolute inset-0 transition-transform duration-100 ease-out"
        :style="{
          transform: `translateX(${mouseX * 25}px) translateY(${
            mouseY * 25
          }px) rotateZ(${mouseX * 2}deg)`,
        }"
      >
        <div class="cosmic-rays"></div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="relative z-10 container mx-auto px-4 py-6">
      <router-link
        to="/"
        class="inline-flex items-center text-white/80 hover:text-white transition-all duration-300 group hover-3d"
      >
        <svg
          class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Вернуться на главную
      </router-link>
    </nav>

    <!-- Hero Section -->
    <section class="relative z-10 container mx-auto px-4 py-16 text-center">
      <div
        class="animate-on-scroll opacity-0 transform translate-y-8 transition-all duration-1000 hover-3d"
        :class="{ 'opacity-100 translate-y-0': isVisible }"
        :style="{
          transform: `translateX(${mouseX * 5}px) translateY(${
            mouseY * 5
          }px) rotateX(${mouseY * 1}deg) rotateY(${mouseX * 1}deg)`,
        }"
      >
        <!-- M2 Syndicate Logo -->
        <div class="mb-8">
          <div
            class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl relative overflow-hidden hover-logo transition-all duration-300"
            :style="{
              transform: `translateX(${mouseX * 10}px) translateY(${
                mouseY * 10
              }px) rotateX(${mouseY * 5}deg) rotateY(${mouseX * 5}deg) scale(${
                isMouseMoving ? 1.1 : 1
              })`,
            }"
          >
            <a href="https://t.me/vash_nik" target="_blank" rel="noopener noreferrer">
              <img src="/images/m2logo.webp" alt="M2 Logo" class="w-15 h-15" />
            </a>
            <!-- Светящийся эффект -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"
            ></div>
            <!-- Дополнительное свечение при движении мыши -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-pink-400/30 opacity-0 transition-opacity duration-300"
              :class="{ 'opacity-100': isMouseMoving }"
            ></div>
          </div>
          <h3 class="text-xl text-purple-300 font-medium tracking-wider">M2 SYNDICATE</h3>
        </div>

        <h1 class="text-5xl md:text-7xl font-bold mb-6">
          <span
            class="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient hover-text"
          >
            Команда
          </span>
          <br />
          <span class="text-white drop-shadow-2xl hover-text">Разработчиков</span>
        </h1>

        <p
          class="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed drop-shadow-lg hover-text"
        >
          Мы создаем исключительные цифровые решения, объединяя креативность с передовыми
          технологиями. Каждый проект — это история успеха наших клиентов.
        </p>
      </div>
    </section>

    <!-- Developers Section -->
    <section class="relative z-10 container mx-auto px-4 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div
          v-for="(dev, index) in developers"
          :key="dev.id"
          class="animate-on-scroll opacity-0 transform translate-y-8 transition-all duration-1000"
          :class="{ 'opacity-100 translate-y-0': isVisible }"
          :style="{
            'transition-delay': `${index * 200}ms`,
            transform: `translateX(${
              mouseX * (index % 2 === 0 ? 8 : -8)
            }px) translateY(${mouseY * 8}px) rotateX(${
              mouseY * 2
            }deg) rotateY(${mouseX * (index % 2 === 0 ? 2 : -2)}deg)`,
          }"
        >
          <!-- Developer Card -->
          <div
            class="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl shadow-xl card-3d"
          >
            <!-- Gradient Overlay -->
            <div
              :class="`absolute inset-0 bg-gradient-to-r ${dev.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`"
            ></div>

            <!-- Дополнительное свечение при наведении -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 blur-xl"
            ></div>

            <!-- Avatar Section -->
            <div class="relative z-10 text-center mb-6">
              <div class="relative inline-block mb-4">
                <!-- Avatar Container -->
                <div
                  class="relative w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-white/20 hover:ring-white/40 transition-all duration-300 shadow-2xl"
                  :style="{
                    transform: `translateZ(${isMouseMoving ? 15 : 0}px) rotateY(${mouseX * 3}deg) rotateX(${mouseY * 3}deg)`,
                  }"
                >
                  <!-- Avatar Image -->
                  <img
                    :src="dev.avatar"
                    :alt="`${dev.name} Avatar`"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    @error="
                      (e) => {
                        e.target.style.display = 'none'
                        e.target.nextElementSibling.style.display = 'flex'
                      }
                    "
                  />

                  <!-- Fallback Avatar with Initials -->
                  <div
                    :class="`absolute inset-0 bg-gradient-to-br ${dev.gradient} flex items-center justify-center text-white font-bold text-xl`"
                    style="display: none"
                  >
                    {{ dev.initials }}
                  </div>

                  <!-- Gradient Border Animation -->
                  <div
                    :class="`absolute inset-0 rounded-full bg-gradient-to-r ${dev.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-pulse`"
                  ></div>
                </div>

                <!-- GitHub Link -->
                <a
                  :href="dev.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group/github"
                  title="GitHub Profile"
                >
                  <svg
                    class="w-5 h-5 group-hover/github:rotate-12 transition-transform duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    />
                  </svg>
                </a>
              </div>

              <!-- Name and Role -->
              <h3 class="text-3xl font-bold text-white mb-2 drop-shadow-lg hover-text">
                {{ dev.name }}
              </h3>
              <p
                :class="`text-lg font-medium bg-gradient-to-r ${dev.gradient} bg-clip-text text-transparent`"
              >
                {{ dev.role }}
              </p>
            </div>

            <!-- Description -->
            <p
              class="relative z-10 text-gray-300 leading-relaxed mb-6 text-center drop-shadow-sm hover-text"
            >
              {{ dev.description }}
            </p>

            <!-- Skills -->
            <div class="relative z-10 mb-8">
              <h4 class="text-white font-semibold mb-3 text-center drop-shadow-sm">Технологии</h4>
              <div class="flex flex-wrap justify-center gap-2">
                <span
                  v-for="skill in dev.skills"
                  :key="skill"
                  class="px-3 py-1 bg-white/5 text-white text-sm rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm skill-tag"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <!-- Contact Links -->
            <div class="relative z-10 flex justify-center space-x-4">
              <!-- GitHub Button -->
              <a
                :href="dev.github"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-4 py-2 bg-gray-800/50 hover:bg-gray-700/70 text-white text-sm font-medium rounded-xl backdrop-blur-sm border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 group/btn shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg
                  class="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
                GitHub
              </a>

              <!-- Portfolio/Contact Button -->
              <button
                class="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 group/btn shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg
                  class="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Связаться
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="relative z-10 container mx-auto px-4 py-16 text-center">
      <div
        class="animate-on-scroll opacity-0 transform translate-y-8 transition-all duration-1000 hover-3d"
        :class="{ 'opacity-100 translate-y-0': isVisible }"
        :style="{
          transform: `translateX(${mouseX * 5}px) translateY(${
            mouseY * 5
          }px) rotateX(${mouseY * 1}deg) rotateY(${mouseX * 1}deg)`,
        }"
      >
        <!-- Main Contact Card -->
        <div
          class="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 mb-12"
        >
          <h2 class="text-4xl font-bold text-white mb-4 drop-shadow-lg hover-text">
            Связаться с нами
          </h2>
          <p class="text-xl text-gray-300 mb-8 drop-shadow-sm hover-text max-w-2xl mx-auto">
            Готовы обсудить ваш проект? Свяжитесь с нами любым удобным способом!
          </p>

          <!-- Contact Buttons Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Telegram Link -->
            <a
              href="https://t.me/m2SYNDICATE"
              target="_blank"
              rel="noopener noreferrer"
              class="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg button-3d"
            >
              <!-- Background Animation -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>

              <div class="relative z-10 flex items-center justify-center">
                <svg
                  class="w-8 h-8 mr-4 group-hover:rotate-12 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.429.26l.213-3.05 5.56-5.02c.24-.213-.054-.334-.373-.12l-6.87 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"
                  />
                </svg>
                <div class="text-left">
                  <div class="text-lg font-bold">Telegram</div>
                  <div class="text-sm opacity-90">@m2SYNDICATE</div>
                </div>
              </div>
            </a>

            <!-- GitHub Organization Link -->
            <a
              href="https://github.com/M2-Syndicate"
              target="_blank"
              rel="noopener noreferrer"
              class="group relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-2xl p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg button-3d border border-gray-700"
            >
              <!-- Background Animation -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>

              <div class="relative z-10 flex items-center justify-center">
                <svg
                  class="w-8 h-8 mr-4 group-hover:rotate-12 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
                <div class="text-left">
                  <div class="text-lg font-bold">GitHub</div>
                  <div class="text-sm opacity-90">Организация</div>
                </div>
              </div>
            </a>
          </div>

          <!-- Additional Contact Info -->
          <div class="text-center">
            <p class="text-gray-400 text-sm mb-4">Или свяжитесь с нашим руководителем проекта</p>
            <a
              href="https://t.me/T1nnLD"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 group/btn shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg
                class="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.429.26l.213-3.05 5.56-5.02c.24-.213-.054-.334-.373-.12l-6.87 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"
                />
              </svg>
              Руководитель проекта
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative z-10 container mx-auto px-4 py-16 text-center">
      <div
        class="animate-on-scroll opacity-0 transform translate-y-8 transition-all duration-1000 hover-3d"
        :class="{ 'opacity-100 translate-y-0': isVisible }"
        :style="{
          transform: `translateX(${mouseX * 3}px) translateY(${
            mouseY * 3
          }px) rotateX(${mouseY * 0.5}deg) rotateY(${mouseX * 0.5}deg)`,
        }"
      >
        <div class="mb-8">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4 relative overflow-hidden shadow-2xl hover-logo"
            :style="{
              transform: `translateX(${mouseX * 8}px) translateY(${
                mouseY * 8
              }px) rotateX(${mouseY * 3}deg) rotateY(${mouseX * 3}deg)`,
            }"
          >
            <a href="https://t.me/vash_nik" target="_blank" rel="noopener noreferrer">
              <img src="/images/m2logo.webp" alt="M2 Logo" class="w-15 h-15" />
            </a>
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"
            ></div>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-white mb-4 drop-shadow-lg hover-text">
          Создано при поддержке M2 Syndicatee
        </h2>
        <p class="text-gray-400 max-w-2xl mx-auto drop-shadow-sm hover-text">
          Мы объединяем талантливых разработчиков для создания выдающихся проектов. Каждое решение
          разрабатывается с вниманием к деталям и стремлением к совершенству.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 3D Perspective */
.perspective-1000 {
  perspective: 1000px;
  transform-style: preserve-3d;
}

/* Космические звезды */
.stars-layer-1 {
  background-image:
    radial-gradient(2px 2px at 20px 30px, #eee, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, #fff, transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: twinkle 4s ease-in-out infinite alternate;
  transform-style: preserve-3d;
}

.stars-layer-2 {
  background-image:
    radial-gradient(1px 1px at 25px 25px, rgba(255, 255, 255, 0.9), transparent),
    radial-gradient(1px 1px at 50px 50px, #fff, transparent),
    radial-gradient(1px 1px at 125px 25px, rgba(255, 255, 255, 0.7), transparent),
    radial-gradient(2px 2px at 50px 100px, #eee, transparent),
    radial-gradient(1px 1px at 150px 75px, rgba(255, 255, 255, 0.8), transparent);
  background-repeat: repeat;
  background-size: 180px 120px;
  animation: twinkle 6s ease-in-out infinite alternate-reverse;
  transform-style: preserve-3d;
}

/* Быстро движущиеся звезды для эффекта полета */
.speed-stars {
  background-image:
    linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent),
    linear-gradient(45deg, transparent, rgba(147, 197, 253, 0.6), transparent),
    linear-gradient(135deg, transparent, rgba(196, 181, 253, 0.6), transparent),
    radial-gradient(1px 1px at 10px 10px, rgba(255, 255, 255, 0.9), transparent),
    radial-gradient(1px 1px at 80px 60px, rgba(147, 197, 253, 0.8), transparent),
    radial-gradient(1px 1px at 150px 20px, rgba(196, 181, 253, 0.7), transparent);
  background-repeat: repeat;
  background-size:
    300px 150px,
    250px 125px,
    200px 100px,
    100px 50px,
    150px 75px,
    120px 60px;
  animation: speed-flight 2s linear infinite;
}

/* Плавающие частицы */
.floating-particles {
  background-image:
    radial-gradient(1px 1px at 10px 10px, rgba(147, 197, 253, 0.8), transparent),
    radial-gradient(1px 1px at 80px 60px, rgba(196, 181, 253, 0.6), transparent),
    radial-gradient(1px 1px at 150px 20px, rgba(134, 239, 172, 0.7), transparent);
  background-repeat: repeat;
  background-size: 160px 80px;
  animation: float 8s ease-in-out infinite;
  transform-style: preserve-3d;
}

/* Космические лучи */
.cosmic-rays {
  background-image:
    linear-gradient(0deg, transparent, rgba(59, 130, 246, 0.3), transparent),
    linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.2), transparent),
    linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.2), transparent),
    linear-gradient(135deg, transparent, rgba(34, 197, 94, 0.2), transparent);
  background-repeat: repeat;
  background-size:
    400px 800px,
    300px 600px,
    500px 1000px,
    350px 700px;
  animation: cosmic-flow 15s linear infinite;
  opacity: 0.3;
}

/* Анимации */
@keyframes twinkle {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}

@keyframes speed-flight {
  0% {
    transform: translateX(-100px) translateY(-50px);
  }
  100% {
    transform: translateX(100vw) translateY(50px);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
  }
}

@keyframes cosmic-flow {
  0% {
    transform: translateY(-100vh) rotate(0deg);
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
  }
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.05);
  }
}

@keyframes gradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 3D Hover эффекты */
.hover-3d {
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
}

.hover-logo:hover {
  transform: rotateY(15deg) rotateX(15deg) scale(1.1);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
}

.hover-planet:hover {
  transform: rotateY(20deg) rotateX(10deg) scale(1.2);
  box-shadow: 0 15px 30px rgba(139, 92, 246, 0.4);
}

.hover-glow:hover {
  filter: brightness(1.2) saturate(1.3);
  transform: scale(1.05);
}

.hover-text:hover {
  text-shadow: 0 0 20px rgba(147, 197, 253, 0.5);
  transform: translateZ(10px);
}

.card-3d {
  transform-style: preserve-3d;
  transition: all 0.3s ease-out;
}

.card-3d:hover {
  transform: rotateY(5deg) rotateX(5deg) translateZ(20px);
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(59, 130, 246, 0.2);
}

.button-3d:hover {
  transform: rotateY(3deg) rotateX(3deg) translateZ(10px) scale(1.05);
  box-shadow:
    0 15px 30px rgba(59, 130, 246, 0.4),
    0 0 20px rgba(139, 92, 246, 0.3);
}

.skill-tag:hover {
  transform: translateZ(5px) scale(1.1);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
}

/* Дополнительные анимации */
.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animation-delay-3000 {
  animation-delay: 3s;
}

.animation-delay-6000 {
  animation-delay: 6s;
}

/* Smooth scroll animations */
.animate-on-scroll {
  transition:
    opacity 1s ease-out,
    transform 1s ease-out;
}

/* Улучшенные тени и свечения */
.drop-shadow-2xl {
  filter: drop-shadow(0 25px 25px rgb(0 0 0 / 0.15));
}

.hover:shadow-3xl {
  box-shadow:
    0 35px 60px rgba(0, 0, 0, 0.3),
    0 0 40px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Дополнительные космические эффекты */
.hover-glow:hover {
  filter: brightness(1.3) blur(1px);
  transform: scale(1.1);
}

/* Responsive 3D эффекты */
@media (max-width: 768px) {
  .card-3d:hover {
    transform: rotateY(2deg) rotateX(2deg) translateZ(10px);
  }

  .button-3d:hover {
    transform: rotateY(1deg) rotateX(1deg) translateZ(5px) scale(1.03);
  }

  .hover-logo:hover {
    transform: rotateY(8deg) rotateX(8deg) scale(1.05);
  }
}

/* Custom scrollbar с 3D эффектом */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #7c3aed);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.5);
}

@media (hover: none) and (pointer: coarse) {
  .card-3d:active {
    transform: scale(0.98);
  }

  .button-3d:active {
    transform: scale(0.95);
  }
}

/* Улучшенная производительность */
.stars-layer-1,
.stars-layer-2,
.speed-stars,
.floating-particles,
.cosmic-rays {
  will-change: transform;
  backface-visibility: hidden;
}

.hover-3d,
.card-3d,
.button-3d,
.hover-logo {
  will-change: transform;
  backface-visibility: hidden;
}

/* Avatar hover effects */
.avatar-container:hover .avatar-image {
  transform: scale(1.1) rotateY(15deg);
}

/* GitHub button hover effects */
.github-btn:hover {
  background: linear-gradient(135deg, #24292e 0%, #1a1e22 100%);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Enhanced 3D effects for avatars */
.avatar-3d {
  transform-style: preserve-3d;
  transition: all 0.3s ease-out;
}

.avatar-3d:hover {
  transform: rotateY(15deg) rotateX(10deg) translateZ(20px);
}

/* Improved button animations */
.contact-btn {
  position: relative;
  overflow: hidden;
}

.contact-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.contact-btn:hover::before {
  left: 100%;
}

/* Enhanced skill tags */
.skill-tag {
  position: relative;
  overflow: hidden;
}

.skill-tag::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.3s;
}

.skill-tag:hover::before {
  left: 100%;
}
</style>
