workflow "New workflow" {
  on = "push"
  resolves = ["GitHub Action for Azure"]
}

action "GitHub Action for Azure" {
  uses = "Azure/github-actions/cli@843845a95833e81c790d80c6e2fa714ccbd5e145"
  runs = "login"
}
