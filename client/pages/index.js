import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Board from '../components/Board/Board';

const data = {
    "name": "Khuat Quang Ngoc",
    "nationality": "Viet Nam",
    "birthday":"17/04/1998",
    "maxAge": 100,
    "events": [
        {
            "publish":true,
            "date":"17/04/1998",
            "title": "The start of everything",
            "content":"I am lucky to be the son of my awesome parents",
            "imageUrls": ["life-data/me-but-small.jpeg"],
            "videoUrls": [],
            "type": "birthday"
        },
        {
            "publish":true,
            "date":"01/06/2002",
            "title": "Big brother at kinder garden",
            "content":"Everyone at my kindergarten called me big brother, not because I'm cool or older than them.\nBut because one of my siblings is in the same class as me, And he called me big brother so everyone else thought they have to call me that too haha.",
            "imageUrls": ["life-data/big-brother.jpeg"],
            "videoUrls": [],
            "type": "memory"
        },
        {
            "publish":true,
            "date":"01/06/2015",
            "title": "My first job at a manufacture",
            "content":"On the summer of 11th grade, I went to work at a manufacture where we are paid to peel litchi fruit.\nThe pay is not much but I've met some wonderful people there.",
            "imageUrls": [],
            "videoUrls": [],
            "type": "memory"
        },
        {
            "publish":true,
            "date":"01/07/2016",
            "title": "Working at a restaurant",
            "content":"The summer before I went to college, I worked at a restaurant as a waiter to learn how to be more socially confident.",
            "imageUrls": ["life-data/work-at-restaurant.jpeg"],
            "videoUrls": [],
            "type": "memory"
        },
        {
            "publish":true,
            "date":"10/09/2016",
            "title": "First year college",
            "content":"I went to Ha Noi University of Industry with a major in IT.\n It's funny that I picked this major as a safe-choice due to my parent's request. \nTurns out if I didn't pick it, I'd probably had to wait another year because all of my initial choices are rejected.",
            "imageUrls": ["life-data/first-year-college.jpeg"],
            "videoUrls": [],
            "type": "memory"
        },
        {
            "publish":true,
            "date":"10/03/2018",
            "title": "My first startup and it's failed",
            "content": "Instead of building a successful business, I'm sure built some lasting friendships",
            "imageUrls": ["life-data/connectus.jpg"],
            "videoUrls": [],
            "type": "career"
        },
        {
            "publish":true,
            "date":"01/10/2017",
            "title": "My first job as a remote AI engineer",
            "content":"Worked with them for 10 months, learned a ton about how to train model and Linux",
            "imageUrls": [],
            "videoUrls": [],
            "type": ""
        },
        {
            "publish":true,
            "date":"01/06/2018",
            "title": "My first full-time job",
            "content": "In the photo is the CEO of company I was working at, he is so supportive and gave me many advices.",
            "imageUrls": ["life-data/tamdongtam.jpg"],
            "videoUrls": [],
            "type": "career"
        },
        {
            "publish":true,
            "date":"01/09/2018",
            "title": "Second job at a startup",
            "content":"We built a platform to teach English for kids online",
            "imageUrls": ["life-data/topica-2.jpg", "life-data/topica.jpg"],
            "videoUrls": ["kidtopi.mp4"],
            "type": "career"
        },
        {
            "publish":true,
            "date":"19/09/2019",
            "title": "Learn how to sky jump",
            "content":"But I've missed so many chances to actually jump. Gotta jump for real next year.",
            "imageUrls": ["life-data/learn-sky-jump.jpeg"],
            "videoUrls": [],
            "type": "experience"
        },
        {
            "publish":true,
            "date":"10/08/2019",
            "title": "Once again I joined a startup - Vantix",
            "content": "It WAS my dream job since Vantix is a company within Vingroup - which I very much admired.",
            "imageUrls": ["life-data/vantix-vinhr.jpeg", "life-data/vantix.jpeg"],
            "videoUrls": [],
            "type": "career"
        },
        {
            "publish":true,
            "date":"04/03/2021",
            "title": "Quited my job and moved to Sai Gon",
            "content": "Trying to figure out what to do with my life",
            "imageUrls": ["life-data/moving-to-saigon.jpeg"],
            "videoUrls": [],
            "type": "career"
        },
        {
            "publish":true,
            "date":"10/04/2019",
            "title": "First time set my foot to San Francisco - US",
            "content": "The trip was fully sponsored by Facebook",
            "imageUrls": ["life-data/first-time-US.jpg"],
            "videoUrls": [],
            "type": "travel"
        },
        {
            "publish":true,
            "date":"13/06/2020",
            "title": "First time to Ca Mau - the most Northern city in Viet Nam",
            "content": "The man standing next to me is Quy - my mentor when I was at Vantix.",
            "imageUrls": ["life-data/ca-mau.jpeg"],
            "videoUrls": [],
            "type": "travel"
        },
        {
            "publish":true,
            "date":"13/01/2020",
            "title": "First time to China",
            "content":"I was on a business trip to attend an event in China",
            "imageUrls": ["life-data/china.jpeg"],
            "videoUrls": [],
            "type": "travel"
        },
        {
            "publish":true,
            "date":"17/04/2020",
            "title": "My 20th birthday",
            "content":"My dad has a birthday cake store, so it's a tradition for us to celebrate birthday every year.",
            "imageUrls": ["life-data/20th-birthday.jpeg"],
            "videoUrls": [],
            "type": "memory"
        },
        {
            "publish":false,
            "date":"17/02/2018",
            "title": "One time I was so happy and free",
            "content":"",
            "imageUrls": [],
            "videoUrls": ["life-data/one-time-I-am-happy.MOV"],
            "type": "memory"
        },
        {
            "publish":true,
            "date":"10/05/2020",
            "title": "A special day",
            "content":"",
            "imageUrls": ["life-data/special-day.jpeg"],
            "videoUrls": [],
            "type": "memory"
        },
        {
            "publish":true,
            "date":"10/03/2019",
            "title": "My first tattoo",
            "content":"It reminds me to check my directions along the journey.\nLike an airplane navigating it from point A to B. While flying the airplane has no clear path to where it wanna go, and most of the time it's does not head toward the destination.\nBut in the end it still got where it want to by being less wrong as it correct its direction.",
            "imageUrls": ["life-data/my-first-tattoo.jpeg"],
            "videoUrls": [],
            "type": "experience"
        }
    ]
}

export default function Home() {
  return (
    <div className="container mx-auto">
      <Board events={data.events} birthday={data.birthday} maxAge={data.maxAge}/>
    </div>
  )
}
