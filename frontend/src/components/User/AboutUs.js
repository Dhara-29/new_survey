import '../User/AboutUs.css'
import Footer from './Footer'
import Header from './Header'

export default function AboutUs() {
    return <>
        <Header />
        <section class="about section" id="about">
            <div class="about__container container grid">
                <h2 class="section__title-1">
                    <span>About Us.</span>
                </h2>

                <div class="about__perfil">
                    <div class="about__image">
                        <img src="./welcome.webp" alt="image" class="about__img" />

                        <div class="about__shadow"></div>

                        <div class="geometric-box"></div>

                        <div class="about__box"></div>
                    </div>
                </div>

                <div class="about__info">
                    <p class="about__description">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt felis. Donec ac augue euismod, feugiat orci nec, egestas ipsum. Curabitur nec erat ac risus auctor cursus. Vivamus quis neque non mauris fringilla tempor.
                    </p>

                    <ul class="about__list">
                        <li class="about__item">
                            <b>Lorem ipsum dolor sit amet Are:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </li>
                    </ul>

                    <div class="about__buttons">
                        <a href="#contact" class="button">
                            <i class="ri-send-plane-line"></i> Contact Us
                        </a>

                        <a href="https://www.linkedin.com/" target="_blank" class="button__ghost">
                            <i class="ri-linkedin-box-line"></i>
                        </a>
                    </div>
                </div>

            </div>
        </section>
        <Footer />
    </>
}