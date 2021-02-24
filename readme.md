### auto generate weekly xlsx by git logs

1.usage

```
npx auto-weekly [options]

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

run under command at a git project base path.

```
npx auto-weekly
```

or just

```
npx auto-weekly -u zhangsan zhangs -ucn 张三 -p . -d ./weekly
```
