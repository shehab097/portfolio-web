import { useEffect, useState } from 'preact/hooks'
import './app.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Skills from './components/Skills'
import About from './components/About'
import Contact from './components/Contact'

export function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem('portfolio-theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  return (
    <div className="selection:bg-primary-dark/20 selection:text-primary-dark">
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      />
      <Hero theme={theme} />
      <Projects theme={theme} />
      <Skills theme={theme} />
      <About theme={theme} />
      <Contact theme={theme} />

      {/* <h1
        className="font-oranienbaum text-5xl justify-center text-primary-dark mb-4
        line-through decoration-20 decoration-primary-dark/20 decoration-offset-1"
      >
        Hello world
      </h1>

      <p
        className='font-oranienbaum text-justify text-lg text-primary-dark'
      >
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti in, tenetur, ullam obcaecati voluptates accusamus fugit aliquid non porro, esse ipsum sed quas iste voluptate similique. Sunt delectus ab neque earum ad quo aut repellat ea asperiores assumenda ipsum reprehenderit enim, explicabo suscipit? Ipsa, similique. Quia architecto dolorum consequuntur maxime minima, non optio iste tenetur illum rerum incidunt! Quasi, ipsam eveniet. Voluptates harum officiis necessitatibus quod mollitia aperiam nulla quasi? Dicta quasi tempore, earum beatae ipsa at quam impedit, eveniet omnis cum exercitationem corporis magni dignissimos repellendus vero incidunt. Deserunt in illum incidunt amet quidem animi eius et deleniti aut non cumque, unde odit quia explicabo perspiciatis optio ducimus magnam dolore possimus, vitae sunt? Velit iste suscipit laudantium? In harum laborum officia dolores aut, molestiae, reiciendis eum at ex veniam voluptas voluptatem sapiente accusamus culpa magni nulla quaerat odit perferendis quia adipisci error. Quae quas ea tempora repellendus quos assumenda dicta dolorem maxime nisi excepturi fugiat non rerum quam animi adipisci quia vero voluptatibus nostrum doloremque rem ut, dolore quasi modi sapiente! Quis cupiditate est debitis nam tempora alias! Inventore nisi, necessitatibus quibusdam asperiores quod dolore similique aliquid ipsum dicta aliquam consequuntur officia ipsam, illo possimus esse eligendi sed qui nostrum. Nobis at laborum repellat similique ipsa voluptate, repudiandae atque saepe dolor vero nisi vitae minima dolores quas deserunt minus nulla rerum temporibus aliquam delectus, rem alias quasi. Libero, atque laborum. Sunt error expedita similique, amet possimus magni omnis quae et hic vero reiciendis quia dolore, sapiente accusamus. In quas dolores facere debitis natus alias autem, quasi delectus voluptatum recusandae iure. Asperiores molestias quod, tempora quas dolore magni? Obcaecati itaque et beatae repellat quis numquam est quia eveniet consequuntur eos debitis fuga quo expedita, rem aut qui consequatur quidem pariatur eligendi. Eaque molestiae qui laudantium nesciunt porro beatae quasi doloribus voluptas animi at? Incidunt laudantium, in hic dolorum repudiandae quia ipsum deserunt porro esse consequuntur facere impedit asperiores. Ex impedit dignissimos, ut consequuntur fuga distinctio culpa obcaecati beatae possimus voluptas accusamus autem corporis. Accusamus, optio at labore, officiis quos dicta iusto cumque illum, doloribus fuga natus. Laboriosam repellat aliquid accusantium qui, dolore sapiente dignissimos obcaecati quod aspernatur exercitationem itaque, expedita minus similique unde tenetur excepturi ex corrupti nihil repudiandae soluta quaerat at esse provident quo! Iusto sit fugit, impedit reiciendis repellendus ratione minima doloremque sed dicta nulla praesentium laudantium rem mollitia cum officiis optio? Ipsam consequuntur fugiat tenetur consequatur voluptatum, perferendis reiciendis iure? Provident, placeat expedita corporis repudiandae iste architecto adipisci dolor ratione earum totam ducimus sunt praesentium necessitatibus eius tempore sint ut assumenda soluta inventore facilis reiciendis dolorem. Ab in commodi placeat labore at saepe tenetur architecto, unde amet, quam iusto recusandae! Tempora exercitationem pariatur unde odio quis ea, eum animi facere ut asperiores! Sint eos minima unde magnam ab? Eveniet similique cum dolorum aut, minima doloribus. Ratione odit architecto sit expedita? Ullam, doloremque libero. Fugit, officiis, praesentium distinctio totam veritatis accusantium excepturi error explicabo consequuntur dolore eveniet quisquam at nemo doloremque, nam perferendis illo ipsa nihil rerum quo!
      </p> */}
    </div>
  )
}
