import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { SERMON_CATALOG } from "../src/lib/sermon-catalog";

const db = new PrismaClient();

async function main() {
  await db.financeEntry.deleteMany();
  await db.weeklyBulletin.deleteMany();
  await db.inquiry.deleteMany();
  await db.galleryImage.deleteMany();
  await db.sermon.deleteMany();
  await db.churchEvent.deleteMany();
  await db.ministry.deleteMany();
  await db.page.deleteMany();
  await db.user.deleteMany();

  const adminHash = await bcrypt.hash("GSSAM-Admin-2026", 10);
  const memberHash = await bcrypt.hash("GSSAM-Member-2026", 10);

  const admin = await db.user.create({
    data: {
      name: "GSSAM Admin (Demo)",
      email: "admin@gssam.demo",
      passwordHash: adminHash,
      role: "ADMIN",
      household: "Church office (demo)",
    },
  });

  const member = await db.user.create({
    data: {
      name: "Priya Sharma (Demo)",
      email: "member@gssam.demo",
      passwordHash: memberHash,
      role: "MEMBER",
      household: "Sharma household (demo)",
    },
  });

  const member2 = await db.user.create({
    data: {
      name: "Arun Reddy (Demo)",
      email: "member2@gssam.demo",
      passwordHash: memberHash,
      role: "MEMBER",
      household: "Reddy household (demo)",
    },
  });

  await db.page.createMany({
    data: [
      {
        slug: "home",
        title: "Welcome to GSSAM",
        excerpt:
          "Please come and join our vibrant, welcoming and engaging community at our worship service on Sundays and/or join our ministries.",
        body: `Good Shepherd South Asian Ministry in Fremont, CA welcomes you to join this community of faith. If you’re unfamiliar with our church, some of what you learn may surprise you.

We are a Lutheran congregation who worship the Lord Jesus Christ through traditional Lutheran hymns from our South Asian congregation members in Telugu, Hindi, Tamil, and English.

Sunday School and worship are together each Sunday from 11:30 AM to 1:00 PM at 4211 Carol Ave, Fremont.`,
      },
      {
        slug: "about",
        title: "About GSSAM",
        excerpt:
          "Good Shepherd South Asian Ministry in Fremont, CA welcomes you to join this community of faith.",
        body: `Welcome to GSSAM

Good Shepherd South Asian Ministry in Fremont, CA welcomes you to join this community of faith. If you’re unfamiliar with our church, some of what you learn may surprise you.

Our church is an engaged, active body of people from various cultural backgrounds. We believe in the Triune God. God created and loves all of creation — the earth and the seas and all of the world’s inhabitants. We believe that God’s son, Jesus Christ, transforms lives through his death on the cross and his new life, and we trust that God’s Spirit is active in the world.

We are part of God’s unfolding plan. When we gather for worship, we connect with believers everywhere. When we study the Bible or hear God’s word in worship, we are drawn more deeply into God’s own saving story.

Please come and join our vibrant, welcoming and engaging community at our worship service on Sundays and/or join our ministries.

Our Vision

Our church’s vision is to glorify God and exalt Him: “At GSSAM Church we aim to build a community of joyful believers in Jesus Christ who love God and His Word, love one another, and love those without Christ by bringing them the good news of salvation. We want to excel in the relationship with God by helping each person fervently love God and others; and to help make disciples of all people groups.” Thus we have an upward focus: glorify and love God.

Church Mission

As the congregation supports the mission of preaching the Good News and spiritually caring for the called-out disciples, they help accomplish many other things as well. These bring benefits to each and every member, to the Church and eventually to the whole world. Thankfully, God provides the power of the Holy Spirit to the baptized members of this Church to help them overcome the challenges in doing His work and glorifying His name.

A Lutheran congregation with South Asian roots

We worship with traditional Lutheran hymns and liturgy, sung and spoken in Telugu, Hindi, Tamil, and English. GSSAM continues the ministry of Good Shepherd Lutheran Church at 4211 Carol Ave in Fremont, serving families across the East Bay and South Bay. We are a Lutheran (ELCA) congregation.

Our Pastor

Pastor Anand Darla shepherds our congregation with a heart for South Asian families — preaching the Word, administering the Sacraments, and leading worship in the languages of our people. He and his family would love to welcome you this Sunday.

What we believe

As a Lutheran congregation we confess the historic Christian faith summarized in the Apostles’ and Nicene Creeds: grace alone, faith alone, and Scripture alone. Holy Baptism and Holy Communion are means of grace. Every member is called and gifted to serve.

Spirituality

The word “disciple” can be used by all Christians. “A ‘disciple’ was not only a pupil, but an adherent; hence they are spoken of as imitators of their teacher; cf. John 8:31; 15:8.” So as God calls more learners, the Church has the mission to teach them “to observe all things that I have commanded you” (Matthew 28:20). This, too, is a challenging and rewarding task.`,
      },
      {
        slug: "contact",
        title: "Contact Us",
        excerpt: "We would be glad to welcome you on Sunday or answer a question during the week.",
        body: `Our location is 4211 Carol Ave, Fremont, California 94538. Sunday School and worship are 11:30 AM–1:00 PM.

You can reach the church office at (510) 688-8241 or gssam2005@gmail.com.`,
      },
      {
        slug: "donate",
        title: "Giving & Offerings",
        excerpt:
          "Thank you for supporting the ministry of GSSAM through tithes, offerings, and special gifts.",
        body: `Your gifts help GSSAM preach the Good News, care for members, and serve our neighbors in Fremont. Offerings may be given during Sunday worship or through the platforms below.

PayPal: gssam2005@gmail.com — please use Donation / gift to friend.
Zelle: gssam2005@gmail.com
Checks mailed to: 4211 Carol Ave, Fremont, CA 94538
Personal bill-pay checks to the same church address.

Are my donations tax-deductible?
GSSAM is a church recognized as a religious organization (EIN 20-5071191). Contributions to the church are generally tax-deductible in the United States to the extent allowed by law. Please keep your receipts and consult a tax professional for your situation.

Can I specify how my gift is used?
You may note a preference such as Sunday School, youth ministry, or benevolence when you give. Undesignated gifts support the general ministry of the congregation.

Can I donate goods instead of money?
Yes. GSSAM periodically collects books, clothing, and food for neighbors in need. Contact the church office before dropping off items so we can receive them well.`,
      },
      {
        slug: "privacy",
        title: "Privacy Policy",
        excerpt: "How GSSAM collects and protects information on this website.",
        body: `Thank you for visiting the GSSAM website. We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our website.

Information we collect
Personal information: We may collect personal information such as your name, email address, phone number, and other similar details when you voluntarily provide them to us, including through the contact form or member portal login.

Non-personal information: We may also gather non-personal information, including browser type, IP address, referring site, and the date and time of each visit. This information is used for statistical purposes to improve our website and services.

How we use your information
Your information may be used to respond to inquiries, personalize your experience, communicate about worship and ministries, and — for signed-in members — to show only your own giving records. Non-personal information may be used for analytics so we can improve the site.

Member financial records
Giving, income, and expense records in the member portal are private. Members see only their own records. Church-wide totals and other households’ gifts are visible only to administrators. Demo sample data in this project is clearly labeled and is not real member finances.

Information sharing
We do not sell, trade, or otherwise transfer your personal information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or serving you, as long as those parties agree to keep this information confidential.

Cookies
Our website uses cookies, including a session cookie after you log in, so we can recognize your browser and keep you signed in. You can disable cookies in your browser, but you will not be able to use the admin or member portals.

Security
We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.

Changes
We reserve the right to modify this Privacy Policy at any time. Changes take effect when posted on this page.

If you have questions about our privacy practices, please contact us at gssam2005@gmail.com.`,
      },
    ],
  });

  await db.ministry.createMany({
    data: [
      {
        slug: "mens-fellowship",
        name: "Men’s Fellowship",
        sortOrder: 1,
        imageUrl: "/images/ministries/mens.jpg",
        summary:
          "Bible study, prayer, mentoring, and service that help the men of GSSAM grow as disciples together.",
        body: `There’s always something special about Christian fellowship and community, the way men and women gather to meet and learn about stewardship. It’s like we’re all a part of this big beautiful garden, each flower unique and special to the whole. These fellowships strengthen us and help us to build relationships, deepen our faith, and figure out God’s purpose for us.

Our Men’s Group focuses on fostering fellowship, spiritual growth, and support among men. We aim to provide a supportive and nurturing environment for men to connect, deepen their faith, and address various aspects of their lives.

Bible Study and Prayer Meetings: Men’s Fellowships involve regular Bible study sessions where our men explore and discuss relevant passages to deepen their understanding of Christian teachings. Group prayer sessions are held regularly and are essential for fostering spiritual growth and providing support for one another.

Community Service & Mentoring: Some of our men engage in community service or outreach programs to demonstrate Christian values through actions and make a positive impact on our community. We establish relationships within the fellowship allowing older or more experienced men to guide and support younger or less experienced members in their faith journey and other life aspects.

Retreats and Conferences: Retreats and conferences for men step away from their daily routines, focus on their faith, and build stronger connections with each other.

Support Groups and Social Events: Building camaraderie through social activities fosters a sense of community and friendship among the members. Men’s Fellowship often provides a platform for men to share their challenges, seek advice, and offer mutual support in a non-judgmental setting.`,
      },
      {
        slug: "womens-fellowship",
        name: "Women’s Fellowship",
        sortOrder: 2,
        imageUrl: "/images/ministries/womens.jpg",
        summary:
          "Bible study, all-night prayer, workshops, and friendship for the women of the congregation.",
        body: `Women’s Fellowship in our church is similar to Men’s Fellowship but is tailored to the specific needs and interests of women in the congregation. The fellowship provides a supportive and nurturing environment where women can connect, deepen their faith, and address various aspects of their lives.

Bible Study: Like their brothers in Christ, Women’s Fellowship organizes regular Bible study sessions where participants delve into scripture, share insights, and support one another in their spiritual journeys.

Women’s Prayer Group: Group prayer sessions offer our women the opportunity to come together to pray for one another, their families, the church, and the community. We have our all-night prayer once a month. Many of our women also engage in community service projects, such as volunteering at local shelters, organizing charity drives, or participating in mission work, to demonstrate Christ’s love in action.

Retreats and Conferences: Retreats and conferences specifically designed for women provide opportunities for spiritual renewal, personal growth, and fellowship with other women. We often provide a supportive environment where our women can share their joys and struggles, seek advice, and offer mutual support in a compassionate and caring setting.

Skill-building Workshops and Study Group: Workshops on topics such as parenting, marriage, finances, and personal development equip our women with practical skills and knowledge to navigate various aspects of their lives. Often we organize study groups focused on Christian literature or relevant topics to encourage discussion and personal growth.

Social Events: Social gatherings such as luncheons, tea parties, and outings foster friendships and strengthen the sense of community among women in the church and neighborhood.`,
      },
      {
        slug: "youth-fellowship",
        name: "Youth Fellowship",
        sortOrder: 3,
        imageUrl: "/images/ministries/youth.jpg",
        summary:
          "A place for GSSAM youth to grow in faith, friendship, music, and service.",
        body: `Our Church Youth Fellowship serves as a platform for youth to connect, grow spiritually, build relationships, and engage in activities that align with their age group and stage of life.

Spiritual Growth: The primary focus is on fostering spiritual growth among the youth and involves Bible study, prayer sessions, worship, and discussions on relevant topics that resonate with the experiences and challenges faced by young individuals.

Community and Fellowship: The youth fellowship also provides a sense of community and belonging. It offers a space where young people can build meaningful relationships with their peers, share experiences, and support one another in their faith journey.

Social Activities: In addition to spiritual growth, youth fellowships often organize social activities and events. These can include outings, game nights, community service projects, and other activities that promote bonding and camaraderie among the members.

Leadership Development: Youth fellowship also focuses on developing leadership skills among the young members and involves leadership training, mentoring programs, music instrument learning, voice training and opportunities for youth to take on responsibilities within the fellowship.

Outreach and Mission: Some of the youth members engage in outreach and mission work, encouraging young people to actively participate in community service and share their faith with others.

Integration with the Larger Church: While the youth fellowship is a distinct group, it is integrated into the larger church community. This allows for intergenerational interactions and opportunities for the youth to contribute to the overall life of GSSAM.`,
      },
      {
        slug: "sunday-school",
        name: "Sunday School",
        sortOrder: 4,
        imageUrl: "/images/ministries/sunday-school.jpg",
        summary:
          "Age-appropriate Bible teaching, songs, and crafts for the children of GSSAM, Sundays 11:30 AM–1:00 PM.",
        body: `Sunday School serves as an integral part of our Church, contributing to the overall educational and spiritual growth of little tiny tots within the church. We provide a structured and nurturing environment for learning about the Christian faith and cultivating a deeper understanding of the Bible. It is also designed to provide structured learning opportunities for people of various age groups, with a primary focus on children and young people, and aims to teach biblical principles, nurture spiritual growth, and provide a foundation for Christian faith.

Age-Appropriate Classes: Sunday School classes are organized based on different age groups, ensuring that the content and teaching methods are appropriate for the developmental stage of the participants.

Biblical Instruction: The core curriculum of Sunday School is centered around the Bible. Children learn about the stories, teachings, and principles found in the Bible. Lessons cover a range of topics, including biblical narratives and moral teachings.

Character Development: Sunday School often emphasizes the development of positive character traits and moral values based on Christian teachings. Lessons focus on virtues such as love, kindness, compassion, and forgiveness.

Worship and Song: Sunday School sessions include worship and singing, providing a creative and participatory element to the learning experience. This helps in reinforcing lessons and creating a sense of community among our children.

Interactive Activities: To engage kids actively, our classes often include interactive activities, such as discussions, games, crafts, and role-playing. These activities are designed to make the learning experience enjoyable and memorable.

Memory Verses: Children are encouraged to memorize key Bible verses as a way of internalizing and retaining important teachings.

Sunday School meets with worship each Sunday from 11:30 AM to 1:00 PM.`,
      },
      {
        slug: "community-engagement",
        name: "Community Engagement",
        sortOrder: 5,
        imageUrl: "/images/events/food.jpg",
        summary:
          "Prayer, study, mentorship, and neighbor-care that take GSSAM’s faith beyond Sunday morning.",
        body: `Our Church is a close-knit congregation of individuals who unite not only in shared religious beliefs but also in the pursuit of spiritual growth and connection. The worship services are extended beyond traditional rituals, encompassing contemporary expressions of spirituality. These include spirit-filled worship, a meditation on the Word of God, and communal prayer circles, fostering a deepened sense of connection to our Lord and Saviour Jesus Christ.

In addition to formal worship, the Church often provides avenues for personal and collective spiritual exploration. We are involved in study groups delving into sacred texts, contemplative prayer sessions, and retreats that offer moments of introspection and renewal.

Furthermore, the Church often emphasizes the importance of spiritual disciplines, encouraging members to engage in practices like fasting, mindfulness, and acts of kindness as a means of deepening their connection with the Holy Spirit. These spiritual activities extend beyond the confines of formal church gatherings, permeating daily life and influencing how individuals navigate challenges, make decisions, and cultivate a sense of inner peace.

The sense of spiritual community is often reinforced through mentorship programs to our members where more seasoned members guide newcomers in their spiritual journey. This mentorship fosters a sense of accountability, encouragement, and shared growth, creating a dynamic and supportive environment for individuals to explore and deepen their spirituality.`,
      },
    ],
  });

  await db.churchEvent.createMany({
    data: [
      {
        slug: "thanksgiving-worship",
        title: "Thanksgiving Worship",
        summary: "A service of gratitude with hymns in Telugu, Hindi, Tamil, and English.",
        body: `Join GSSAM for Thanksgiving worship as we give thanks to God for harvest, family, and the gift of Christ. All are welcome — members, neighbors, and guests visiting Fremont for the holiday.

Worship includes congregational singing, Scripture, and a time of testimony. A fellowship meal follows in the church hall.`,
        location: "4211 Carol Ave, Fremont, CA 94538",
        startsAt: new Date("2026-11-26T11:30:00-08:00"),
        endsAt: new Date("2026-11-26T13:30:00-08:00"),
        imageUrl: "/images/events/thanksgiving.jpeg",
        published: true,
      },
      {
        slug: "christmas",
        title: "Christmas Worship",
        summary: "Celebrate the birth of our Lord Jesus Christ with the GSSAM family.",
        body: `Christmas at GSSAM is a joyful gathering of the South Asian Lutheran family in Fremont. We hear the nativity story, sing carols and Lutheran hymns, and welcome children to take part in the service.

Come early for carol singing. A light reception follows worship.`,
        location: "4211 Carol Ave, Fremont, CA 94538",
        startsAt: new Date("2026-12-25T11:30:00-08:00"),
        endsAt: new Date("2026-12-25T13:00:00-08:00"),
        imageUrl: "/images/events/christmas.jpg",
        published: true,
      },
      {
        slug: "new-year",
        title: "New Year Worship",
        summary: "Begin the year in prayer, Scripture, and hope in Christ.",
        body: `GSSAM gathers for New Year worship to give thanks for the year past and to ask God’s blessing on the year ahead. We pray for families, ministries, and our city of Fremont.`,
        location: "4211 Carol Ave, Fremont, CA 94538",
        startsAt: new Date("2027-01-01T11:30:00-08:00"),
        endsAt: new Date("2027-01-01T13:00:00-08:00"),
        imageUrl: "/images/events/new-year.jpg",
        published: true,
      },
      {
        slug: "good-friday",
        title: "Good Friday Worship",
        summary: "A solemn service remembering the cross of Christ.",
        body: `On Good Friday the congregation gathers in the evening to hear the passion of our Lord, sing hymns of the cross, and pray. This quieter service prepares us for the joy of Easter morning.`,
        location: "4211 Carol Ave, Fremont, CA 94538",
        startsAt: new Date("2027-03-26T19:00:00-07:00"),
        endsAt: new Date("2027-03-26T20:30:00-07:00"),
        imageUrl: "/images/events/good-friday.jpg",
        published: true,
      },
      {
        slug: "food-donation",
        title: "Food Donation Drive",
        summary: "Collecting non-perishable food for neighbors in Fremont.",
        body: `GSSAM’s community engagement ministry is collecting canned goods, rice, lentils, and other non-perishable foods. Drop off donations on Sunday mornings in the narthex, or contact the church office to arrange another time.`,
        location: "4211 Carol Ave, Fremont, CA 94538",
        startsAt: new Date("2026-10-04T11:30:00-07:00"),
        endsAt: new Date("2026-10-25T13:00:00-07:00"),
        imageUrl: "/images/events/food.jpg",
        published: true,
      },
      {
        slug: "clothing-donation",
        title: "Clothing Donation Drive",
        summary: "Gently used clothing for families in our community.",
        body: `Bring clean, gently used clothing for all ages. Women’s Fellowship and Youth Fellowship will sort donations after worship. Please bag items and label sizes when you can.`,
        location: "4211 Carol Ave, Fremont, CA 94538",
        startsAt: new Date("2026-09-13T11:30:00-07:00"),
        endsAt: new Date("2026-09-27T13:00:00-07:00"),
        imageUrl: "/images/events/clothing.jpg",
        published: true,
      },
      {
        slug: "books-donation",
        title: "Books Donation Drive",
        summary: "Bibles, children’s books, and school supplies for local families.",
        body: `Sunday School is gathering children’s books, Bibles, and school supplies to share with families connected to GSSAM and nearby partners. New or gently used items are welcome.`,
        location: "4211 Carol Ave, Fremont, CA 94538",
        startsAt: new Date("2026-09-20T11:30:00-07:00"),
        endsAt: new Date("2026-10-11T13:00:00-07:00"),
        imageUrl: "/images/events/books.jpg",
        published: true,
      },
    ],
  });

  await db.sermon.createMany({
    data: SERMON_CATALOG.map((sermon) => ({
      title: sermon.title,
      youtubeId: sermon.youtubeId,
      preacher: "GSSAM Fremont",
      preachedAt: sermon.preachedAt,
      description: sermon.description,
    })),
  });

  const gallery = [
    [1, "Sunday worship", "Worship"],
    [2, "Congregation gathering", "Fellowship"],
    [3, "Hymn singing", "Worship"],
    [4, "Fellowship after service", "Fellowship"],
    [5, "Church family", "Congregation"],
    [6, "Prayer and praise", "Worship"],
    [7, "Youth and families", "Fellowship"],
    [8, "Worship service", "Worship"],
    [9, "Congregation in the sanctuary", "Congregation"],
    [10, "Sunday morning", "Worship"],
    [11, "Members together", "Fellowship"],
    [12, "Church life at GSSAM", "Congregation"],
    [13, "A Sunday at 4211 Carol Ave", "Congregation"],
    [14, "Community of faith", "Fellowship"],
    [15, "Worshiping together", "Worship"],
    [16, "GSSAM families", "Congregation"],
    [17, "After-service fellowship", "Fellowship"],
    [18, "In the sanctuary", "Worship"],
    [19, "South Asian Lutheran family", "Congregation"],
    [20, "Life together", "Fellowship"],
  ] as const;

  await db.galleryImage.createMany({
    data: [
      ...gallery.map(([n, title, album]) => ({
        title,
        album,
        caption: `${title} at Good Shepherd South Asian Ministry, Fremont.`,
        url: `/images/gallery/${n}.jpg`,
      })),
      {
        title: "Bishop’s visit",
        album: "Worship",
        placement: "home",
        caption: "Worship with visiting clergy at GSSAM Fremont.",
        url: "/images/real-bishop-visit.jpg",
      },
      {
        title: "Palm Sunday family",
        album: "Congregation",
        placement: "hero",
        caption: "The GSSAM family on Palm Sunday.",
        url: "/images/real-congregation.jpg",
      },
      {
        title: "Children leading song",
        album: "Worship",
        placement: "home",
        caption: "Children leading worship in song.",
        url: "/images/real-kids-singing.jpg",
      },
      {
        title: "Holy Communion",
        album: "Worship",
        placement: "home",
        caption: "Invitation to Holy Communion.",
        url: "/images/real-communion-wide.jpg",
      },
      {
        title: "Honoring our elders",
        album: "Fellowship",
        placement: "home",
        caption: "Honoring the elders of the congregation.",
        url: "/images/real-elders.jpg",
      },
      {
        title: "Communion Sunday",
        album: "Worship",
        placement: "home",
        caption: "The congregation coming forward for Communion.",
        url: "/images/real-communion-line.jpg",
      },
      {
        title: "Palm Sunday celebration",
        album: "Congregation",
        placement: "home",
        caption: "Palm Sunday at GSSAM.",
        url: "/images/real-palm-sunday.jpg",
      },
      {
        title: "Preparing the altar",
        album: "Worship",
        caption: "Altar candles prepared for worship.",
        url: "/images/real-altar-candles.jpg",
      },
    ],
  });

  await db.weeklyBulletin.createMany({
    data: [
      {
        weekOf: new Date("2026-08-31T00:00:00-07:00"),
        title: "Week of August 31, 2026",
        scripture: "Psalm 23; John 10:11–16 — The Lord is my shepherd.",
        worshipNotes:
          "Sunday School and worship 11:30 AM–1:00 PM. Hymns in Telugu, Hindi, Tamil, and English. Holy Communion this Sunday.",
        announcements:
          "Women’s Fellowship all-night prayer this Friday. Clothing donation bags may be left in the narthex. Youth choir rehearsal after worship.",
        offeringTotalCents: 184500,
        published: true,
      },
      {
        weekOf: new Date("2026-08-24T00:00:00-07:00"),
        title: "Week of August 24, 2026",
        scripture: "Isaiah 40:11; Luke 15:3–7 — The shepherd who seeks the lost.",
        worshipNotes:
          "Sunday School and worship 11:30 AM–1:00 PM. Men’s Fellowship breakfast Saturday at 8:30 AM in the hall.",
        announcements:
          "Sign up to help with the September food drive. New visitors are invited to stay for tea after worship.",
        offeringTotalCents: 162000,
        published: true,
      },
      {
        weekOf: new Date("2026-08-17T00:00:00-07:00"),
        title: "Week of August 17, 2026",
        scripture: "Philippians 2:1–11 — The mind of Christ.",
        worshipNotes:
          "Sunday School and worship 11:30 AM–1:00 PM. Special prayer for students returning to school.",
        announcements:
          "Sunday School teachers meeting after worship. Please update your household contact information with the church office.",
        offeringTotalCents: 171250,
        published: true,
      },
    ],
  });

  const demoNote = "DEMO SAMPLE DATA — not a real offering or household record.";

  await db.financeEntry.createMany({
    data: [
      {
        memberId: member.id,
        kind: "TITHE",
        amountCents: 15000,
        occurredOn: new Date("2026-08-03"),
        category: "Weekly tithe",
        memo: demoNote,
        scope: "MEMBER",
        isDemo: true,
      },
      {
        memberId: member.id,
        kind: "OFFERING",
        amountCents: 4000,
        occurredOn: new Date("2026-08-10"),
        category: "Sunday offering",
        memo: demoNote,
        scope: "MEMBER",
        isDemo: true,
      },
      {
        memberId: member.id,
        kind: "OFFERING",
        amountCents: 3500,
        occurredOn: new Date("2026-08-17"),
        category: "Sunday offering",
        memo: demoNote,
        scope: "MEMBER",
        isDemo: true,
      },
      {
        memberId: member.id,
        kind: "OFFERING",
        amountCents: 5000,
        occurredOn: new Date("2026-08-24"),
        category: "Sunday offering",
        memo: demoNote,
        scope: "MEMBER",
        isDemo: true,
      },
      {
        memberId: member.id,
        kind: "INCOME",
        amountCents: 120000,
        occurredOn: new Date("2026-08-01"),
        category: "Household income (demo)",
        memo: demoNote,
        scope: "MEMBER",
        isDemo: true,
      },
      {
        memberId: member.id,
        kind: "EXPENSE",
        amountCents: 2500,
        occurredOn: new Date("2026-08-15"),
        category: "Benevolence gift",
        memo: demoNote,
        scope: "MEMBER",
        isDemo: true,
      },
      {
        memberId: member2.id,
        kind: "TITHE",
        amountCents: 20000,
        occurredOn: new Date("2026-08-03"),
        category: "Weekly tithe",
        memo: demoNote,
        scope: "MEMBER",
        isDemo: true,
      },
      {
        memberId: member2.id,
        kind: "OFFERING",
        amountCents: 7500,
        occurredOn: new Date("2026-08-17"),
        category: "Sunday offering",
        memo: demoNote,
        scope: "MEMBER",
        isDemo: true,
      },
      {
        memberId: member2.id,
        kind: "INCOME",
        amountCents: 185000,
        occurredOn: new Date("2026-08-01"),
        category: "Household income (demo)",
        memo: demoNote,
        scope: "MEMBER",
        isDemo: true,
      },
      {
        memberId: null,
        kind: "INCOME",
        amountCents: 184500,
        occurredOn: new Date("2026-08-31"),
        category: "Weekly offerings (church total)",
        memo: `${demoNote} Church-wide sample total for the week.`,
        scope: "CHURCH",
        isDemo: true,
      },
      {
        memberId: null,
        kind: "EXPENSE",
        amountCents: 42000,
        occurredOn: new Date("2026-08-12"),
        category: "Utilities",
        memo: `${demoNote} Sample church expense.`,
        scope: "CHURCH",
        isDemo: true,
      },
      {
        memberId: null,
        kind: "EXPENSE",
        amountCents: 18500,
        occurredOn: new Date("2026-08-20"),
        category: "Sunday School supplies",
        memo: `${demoNote} Sample church expense.`,
        scope: "CHURCH",
        isDemo: true,
      },
      {
        memberId: admin.id,
        kind: "OFFERING",
        amountCents: 10000,
        occurredOn: new Date("2026-08-10"),
        category: "Sunday offering",
        memo: demoNote,
        scope: "MEMBER",
        isDemo: true,
      },
    ],
  });

  console.log("Seeded GSSAM demo data.");
  console.log("Admin login:  admin@gssam.demo  /  GSSAM-Admin-2026");
  console.log("Member login: member@gssam.demo /  GSSAM-Member-2026");
  console.log("Member 2:     member2@gssam.demo / GSSAM-Member-2026");
}

main()
  .then(() => db.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
