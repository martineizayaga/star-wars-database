![Star Wars Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Star_Wars_Logo.svg/694px-Star_Wars_Logo.svg.png)
# STAR WARS swapi Challenge
A web application that lets you search for your favorite Star Wars characters' info using swapi.co.

## 🚀 Getting Started
These instructions are to get you up and running.

### `yarn`
To install the dependencies

### `yarn start`
Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload when you make edits.<br />
You will also see any lint errors in the console.

## 🎁 Demo
![Demo](https://media.giphy.com/media/SYpGmAZYXcSAcchCzx/giphy.gif)

Click on the image below to go to the website! 👇
[<img src="https://i.ibb.co/JcFQ44y/Screen-Shot-2019-10-23-at-9-45-21-AM.png">](https://star-wars-directory-challenge.netlify.com/)!

## 📝 Specification
- [x] At least two (2) web components.

    I have an App component and a CharacterTable component.
- [x] Pass data between components.

    I pass the chosen character name, person data, and film data.
- [x] Character description should be a combination of your own words plus the Character’s data

   I included planet data so that people could know where the character is from and put it into my own words.
- [x] Style the movie list to look like a table. Even and Odd rows should have their own style.

    Check. I chose to use a Table API, but I still had to code in the even-odd CSS rule.
- [x] The application should be responsive (breaking point – mobile friendly).

    Check. Tested on mobile with Chrome Web Inspector.
- [x] Use at least one (1) DOM event.

    There's an onChange event for the character input (and there's also an onClick event for an easter egg of sorts shhhh don't tell anyone 👀.)
- [x] Use iteration whenever is possible.

    I initially was just using the [Ant Design UI library](https://ant.design/). Once I got a minimum viable product I wanted to see if I could get the dropdown functionality with just basic HTML, CSS, and JS. I found that you can use an input text tag and a datalist tag to make that happen. [This Codepen](https://codepen.io/BTM/pen/ZKxKPo?editors=1111) was very helpful.
    
    I also made a paper prototype below, but later decided that displaying "No results found" would not be relevant. The table would already disappear, so the user would know that the input is invalid.
    
    ![Paper Prototype](https://i.ibb.co/C0MJgzN/IMG-3586-1.jpg)
