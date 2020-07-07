
import LinkButton from '../components/linkButton';
import Clouds from '../components/clouds';

export default function Index() {
    return (
        <Clouds>
            <main>
                <img src="/images/logo.png" alt="White Raven" />
                <nav>
                    <LinkButton href="/communication" colour="blue" size="large">
                        Communication
                    </LinkButton>
                    <LinkButton href="/about" colour="green" size="medium">
                        About
                    </LinkButton>
                    <LinkButton href="/reviews" colour="yellow" size="small">
                        Reviews
                    </LinkButton>
                    <LinkButton href="/consultation" colour="orange" size="x-small">
                        Consultation
                    </LinkButton>
                </nav>
            </main>
            <style jsx>{`
                main {
                    background-color: #6698CC;
                    background-image: radial-gradient(70% 90% at bottom right, #C69838, #6698CC);
                    background-size: cover;
                    min-height: 100vh;
                    display: grid;
                    place-items: center center;
                    grid-template-columns: repeat(2, 1fr);
                    padding: 8vw;
                }
                img {
                    width: 330px;
                    place-self: start center;
                }
                nav {
                    display: grid;
                    place-items: center center;
                }
            `}</style>
        </Clouds>
    )
} 