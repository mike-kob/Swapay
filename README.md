# Swapay

Swapay (comes from "to swap") is a pet-project marketplace designed for people 
to share (exhange, sell, rent) their board games that they might not need
at the moment.

Demo: [swapay.vercel.app](https://swapay.vercel.app/en) \
Available languages: `en`, `uk` 

## Project structure
### Backend
The backend project is named `juno` (after NASA [juno mission](https://www.jpl.nasa.gov/missions/juno)).
Basically this is Django-based graphql server to manage business logic 
and provide admin interface.\
\
More details on `juno` folder.

### Frontend
The frontend project is named `terra` (after NASA [terra mission](https://terra.nasa.gov/about/mission)).
The stack:
```shell
react
next
material-ui
redux
```

Public pages (such as catalog page, game page) use server side rendering or 
static generation. Profile pages are client-based and use redux for 
state management.

## Screenshots

## Acknowledgments
To the project contributed:
- @mike-kob
- @dashayaskova
- @pechurkam

Design by @leprekonchek
