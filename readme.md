### 周报生成脚本

1.使用方式

```
npx weekly [options]

Options:
  -V, --version                output the version number
  -u, --users [users...]       filter by usernames
  -p, --path <path>            git repository in local system path
  -d, --dist <dist>            the directory output weekly excel
  -ucn, --username <userName>  reporter user name chinese version
  -from, --from <startDate>    filter commits after start date, yyyy-mm-dd (default: "current week start date")
  -to, --to <endDate>          filter commits before end date, yyyy-mm-dd (default: "current week end date")
  -h, --help                   display help for command
```

2.example

```
npx weekly -u caoxi caoxm -ucn 曹西梦 -p . -d ./weekly
```
