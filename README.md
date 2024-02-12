This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Game of Life   
A program that simulates life based on the availability of resources and friends.  
This program is made by Rifky Ariya Pratama as a technical interview assignment at MetaPals.

## Tech Stack  
This program is a single file, single page app made in NextJS and Typescript. NextJS because its (most probably) the stack i'm going to work on MetaPals. Typescript because i've been wanting to learn Typescript for a long time. This technical assignment is a lovely excuse for me to learn these.  

## Installation 
Because its made in NextJS, the instructions are very basic: 

- clone the repo  
- run `npm i` to install the libraries (only react-toastify)  
- run `npm run dev`  
- open `localhost:3000` on your browser  

voilà

## Usage  
- insert the length and width at the control box on top left corner (recommended 12x12)  
- click the cells to create a pattern. clicked cell will come alive (red). if you click again, it will die (black).
- press `Generate Next`, program will simulate the growth and dying of the cells  
- track the generation count at the top right corner  
- stop the generation by pressing the `Stop Generating` button. generation count will persist, and you can continue generating
- press `Reset Matrix` to reset the whole canvas, start a new pattern.

### Enjoy! 