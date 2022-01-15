
module.exports = {
    name: "takequiz",
    execute(message) {
        const filter = (message) => !message.author.bot;

        let questions = [];
        let rows = [];
        let counter = 0;
        let labels = ["A", "B", "C", "D"];

        let index = 0;
        let correct = 0;

        for(let i = 0; i < db.questions.data.length; i++) {
        questions.push(db.questions.data[i].text);
        let tempArr = [];

        for(let j = 0; j < db.questions.data[i].answers.data.length; j++) {
            let tempObj = {
            label: labels[j],
            };
            tempObj.description = db.questions.data[i].answers.data[j].text;
            tempObj.value = `Option ${j + 1}`;
            tempArr.push(tempObj);
        }
        rows.push(
            new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("select")
                .setPlaceholder("Nothing selected")
                .addOptions(tempArr)
            )
        );
        }

        const collector = message.channel.createMessageComponentCollector({
        max: rows.length,
        });

        client.on("interactionCreate", async (interaction) => {
        //if (!interaction.isSelectMenu()) return;

        if (interaction.customId === "select") {
            let answer = interaction.values[0];
            answer = answer.substring(7);
            console.log(db.questions.data[index].answers.data[answer - 1].text)
            console.log(db.questions.data[index].correctAnswer.text)
            if(db.questions.data[index].answers.data[answer - 1].text == db.questions.data[index].correctAnswer.text){
            correct++
            }
            await interaction.update({
            content: `You chose ${interaction.values[0]}`,
            components: [],
            });
        }

        if (counter < rows.length) {
            const count = counter++;
            message.channel.send({
            content: questions[count],
            components: [rows[count]],
            })
            index++;
        }
        });
        // collector.on("collect", () => {
        //   if (counter < rows.length) {
        //     const count = counter++;
        //     message.channel.send({
        //       content: questions[count],
        //       components: [rows[count]],
        //     })
        //     .then(async(collected) => {
        //       collected = await message.update({
        //         filter,
        //         max: 1,
        //         time: 30000,
        //         errors: ["time"],
        //       });
        //       console.log(collected)
        //     })
        //   }
        // });

        collector.on("end", (collected) => {
        console.log(index)
        console.log(correct)
        if(index + 1 === correct){
            db.links.count++;
            message.channel.send({
            content: `Perfect! Here is the link for your POAP: ${db.links.data[db.links.count]}`,
            });
        }
        else {
            message.channel.send(`Your score was ${correct} / ${db.questions.data.length}. Please try again.`);
        }
        });

        const count = counter++;
        message.channel.send({
        content: questions[count],
        components: [rows[count]],
        });
    }
}