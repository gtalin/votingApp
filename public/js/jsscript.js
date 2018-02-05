console.log("client js");
console.log(pollData.options);
new Chart(document.getElementById("doughnut-chart"), {
  type: 'doughnut',
  data: {
    labels: pollData.options,
    datasets: [
      {
        label: pollData.title,
        backgroundColor: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
        data: pollData.votes
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: pollData.title
    }
  }
});
