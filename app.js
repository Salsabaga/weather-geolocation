require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.set("view engine", "ejs");

app.listen(3000, () => {
	console.log("Server is listening");
});

app.locals.dateConverter = (date) => {
	const d = new Date(date * 1000);
	return d.toLocaleDateString("en-GB");
};

app.locals.timeConverter = (num) => {
	const d = new Date(num * 1000);
	const hour = d.getHours();
	const min = d.getMinutes();
	return `${hour < 9 ? "0" + hour : hour}:${min < 9 ? "0" + min : min}`;
};


app.post("/weather", (req, res) => {
	const searchBar = req.body.citySearch;
	const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchBar}&units=metric&appid=${process.env.API_KEYS}`;
	fetch(apiUrl).then(res=>res.json()).then(json=>{
		if(json.cod === "400" || json.cod === "404"){
			res.render("error", {errMsg: "Uh Oh! That city could not be found! Enter another one!"})
		}
		res.render("weather", { data: json })
	})

});
