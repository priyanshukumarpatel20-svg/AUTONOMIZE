/* ============================================================
   Autonomize dashboard — behaviour
   Sections: theme · navigation · card tilt · reveal · charts
             · heatmap · accordion · photo upload
   ============================================================ */

(function () {
  'use strict';

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- brand logo (carried over from the previous build) ---- */
  var LOGO = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAIAAgADASIAAhEBAxEB/8QAHgABAAICAwEBAQAAAAAAAAAAAAgJBgcBBQoCAwT/xABFEAACAQMDAQQGBggEBgIDAQAAAQIDBAUGBxEIEiExQQkTIlFhcRQyN3aBtBUWI0JSkaGiF2JysSQzVHODwVPCQ0bRkv/EABsBAQACAwEBAAAAAAAAAAAAAAAEBQECAwYH/8QANhEBAAIBAQUFBwMEAQUAAAAAAAECAwQFERIhMTJBUWFxBhMikaGx8EKB0RQzwfFDFSMkNOH/2gAMAwEAAhEDEQA/ALPQAAAAAAAACP8Av71tbL7Cyr4a9yctRampJr9C4qcZzpT8lXq/Uo/FPmfD5UGdcODJqLcGKN8sWtFY3ykAaz3R6lNkNm1Upa/3Dxdje049r9HUZu4vX7v2FJSmufJySXxKvN6evnfzd118dY5z9T8FUbSsMHOVKpOHuq3HPrJ93c1Fwi/4SOFSpUrVJVas5TnNuUpSfLk34tvzZ6LS+ztrfFqLbvKP5/2i31UfphZJuF6V7S9p6y12u2xyGRny1G8zdxG2pr4qlS7cpL5zgyPesPSQ9UGp5zWL1Dh9M0Z93q8Vi6bfH+u49bJP4poi6C6w7J0eHpSJ9ef3R7Zr272xs/1H7/anc/03vNrK4hPvlSjma9Ok/wDxwko/0MLv9S6jyku3k9QZK8k/Ovd1Kj/ubOtBOripTlWsR+znMzPVzKUpvtSk235tnAB0YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOYylB9qMmmvNM4AHZWGpdR4uSnjNQZKzkvB0LupTf9rRmuA6j9/tMOH6E3m1lbwh3xpSzNepSX/jnJx/oa4BztipftRE/szEzHRKLR/pIeqDTE4LKahw+pqMO71eVxdNPj/Xb+qk38W2SD2+9K/pq7nStN0Nr77Hc8Kd7hbqNzDn3+pq9hxXynJ/AraBBzbJ0ebrSI9OX2dK5r1716W13UvsbvI6dvoDcXGXt9UXKx1aTtrz4pUaqjOXHm4pr4mzjzwwnOlONWlOUJwalGUXw014NMkdst18b+bQyt8de539b8DS4i8dm5yq1IQ91K5/5sHx3JNygv4Sl1Xs7avxae2/yn+f9JFNVH6oXIAj9sF1ubLb8O3w9rk3pvU9ZKP6Fys4wnVn7qFX6lb4JcT8+wiQJ53Ngyae3BljdKVW0WjfAADkyAAAAAAAAAAAY/rvX+jtstMXesdd5+1w+IsY81bm4l3NvwhGK5lOb8FGKcn5IxLf7qE0D07aNlqrWd26tzX7VPGYuhJfSb+sl9WCfhFcrtTfdFNeLcYunzfzqJ3F6iNVy1DrXIuFlQlJY3E0JNWthTflCP702uO1UftS48kklbbN2Vk108U8qePj6OOXNGPl3t8dTXpFddbmzvNI7RSutKaWnzSnep9jJX0PB8zi36iD/hg+014y4biocSlKcnOcnKUny23y2zgHtdPpcWkpwYo3R+dVfa9rzvsAAkNQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzGUoSU4ScZRfKafDTJjdM/pFNd7Y1LTSe7k7vVulo9mlC7lLtZKwh74zk/28F/DN9r3SSXZcOAR9RpcWrpwZY3x+dG1b2pO+r0AaD3A0budpm01joPUFpmcReLmncW8ueJecJxftQmue+MkpLzRkBRfsJ1E7jdPGqo6h0TknOzryisjibiTdpf015TivCaXPZmvaj8U2ncFsD1C6A6idHR1Toy7dK6t+zTyeKryX0mwrNfVml9aL4fZmu6ST8GpRXitpbKyaGeKvOnj4eqwxZoycu9s4AFS7AAAAAAay6hN/tG9O2ga+tNVTdxc1W6GLxlOaVa/ueOVCPP1YrxnPjiK97cYvLdwNeaZ2x0blteaxyEbPEYa3dxcVH3yflGEF+9OUmoxj5ykkUn9RW/equofca81tqCc6FlBuhicap9qnYWifswXk5v605fvSb8EklbbK2bOuycVuxHXz8nHNl93HLq6Td7d7W292t73Xmu8nK5vbp9mjRi2qFnQTfYoUYt+zCPPzbbbbbbeFAHu6UrjrFaxuiFdMzM75AAbMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGa7Q7va32R1vZa70Hk5Wt7avs1qMuXQu6Da7VGtDn2oS4+aaTTTSawoGt6VyVmto3xLMTMTvhel097/aN6idA0NZ6WqeouaTVDKYypNSrWFzxy4S/ii/GE+OJL3NSitnFF/Ttv5qvp43FtNa6dqTr2c3Ghlsa58U7+1b9qD9014wl+7JeabTuw0BrzTO5ujsVrvR2Rje4jMW6uLequ5rylCS/dnGScZR8pRa8jwm1dmzocnFXsT08vJY4cvvI59WQAAqXYAI/dbm/sthtlr27w12qWp9RuWKwvEuJ0pyj+1uF/24d6f8cqfPidcGG2oyRip1li1orG+UJ/SKdTM9zddS2j0jke1pbSdw43k6U+YX+SjzGcuV4wpcuEf83rH3rstQ4OZSlOTnOTlKT5bb5bZwfRtLp6aTFGKnSPzeqr2m9uKQAEhqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEx/R1dTM9stdR2i1bkezpbVlwo2c6svYsclLiMJc+UKvChL/ADerfcu03Dg5jKUJKcJOMovlNPhpkfVaemrxTiv0n83tqWmluKHofBH/AKJN/Zb87LWV5mLtVdT6dccVmuX7dWcY/srh/wDchw2/DtxqJeBIA+c58NtPknFfrC1raLRvgKcOvjemW72/mTssddurgtH9rB49RlzCdSEn9Iqry9qr2oprxjTgWhdS26P+Dex2rtf0a0ad9ZWEqOOb/wCsrNUqD48+JzjJr3RZRdUnOrOVWrOU5zblKUny234ts9F7O6XitbUW7uUf5/PNF1V+UVfIAPWIQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkj0Db0S2i39xljkLt08FrHs4PIJy4hCpOS+jVX5ezVajy/CNSZceeeGnUqUqkatKcoTg1KMovhprwafkXpdNW6H+Mex2kdf1q0al7fWEaORa/6yi3Srvjy5qQlJL3SR5P2i0vDauor38p/x+eSbpb8pqih6V7cGVppnRW11rW4eRu62bvIp8NQox9VRT96lKrVfzporaJRekh1hPU/VDlsWqvbo6ZxtliaXD7lzT+kT/FTuJJ/Ii6XWycPudHSPGN/z5o+a3FkkABZOQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFk/oodwXd6X1ptfdVm5Y28o5qzjJ88wrR9VWS9yjKlSfzqMrYJR+jd1hPTHVBisU6vYo6mxt7iqvL7uVT+kQ/Ht28Uv8AV8St2th99o7x4Rv+XN1w24bw1F1H596n3+3EzfrHOFxqbIxpSb8aUK84U/7IxNcnZalv5ZTUeVyc3zK7va9d/OdRy/8AZ1pOxV4KVrHdEOczvneAA6MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbH6b8+9Mb/7d5v1nq4UNTY6NWXPhSnXhCp/ZKRrg7PTN/LFakxOTg+JWd9Qrr5wqRl/6OeWvHSa+MSzE7p3utlJzk5SfLb5ZwAdGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5jJwkpRfDT5RwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD9ba1uryqqFnbVa9R+EKcHKT/BGfaW6e97tauP6sbXaivlLwlCyml/NpGl8lMcb7zuZiJno14CSOG9Hp1U5mEZw2/p2fa8ry9p0WvwbMnt/RhdTdWKdaywFFvxTydOXH8iNbaGkr1yR820Yrz3Ijglvc+jC6nKUW6FjgK7Xglk6cef5mL5r0e/VThYSnPb1XnZ8rK8p1m/l2WK7Q0luUZI+Z7q8dyOANhap6e97tEpy1RtdqLHxj+9UsZtfzSZgVxbXFpVdG6t6lGpHxhUg4yX4Mk0yUyRvpO9rMTHV+QAN2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD7o0a1xVjQt6U6tSb4jCEXKUn7kl4kgOnfoo3c3/rUslaWDwem+0lUyt9BxjJefqo+M38u4sT0D01dLvSLp9as1RWxtS/tqfaq5jNzhKbkvH1VN90e/w4TfxKvV7Ww6WeCvxX8IdqYbX59IV6bN9B+/28EaGRo6d/V/D1eH9PyvNJOPvjD60vwRM7bf0XmzGj6EMnudqS91FXpJSqQ7atbSL80/OS+bRim9XpU8LjpVsNsjph5GpHmCymSi6dFfGFLxl+PBCTc7qf3y3cr1J6y3AyVS2qNtWdtUdC3in5KEOOV82yHFNp67nafd1+v58m+/Dj6c5WlXm4XQ305UVY2tXRuOuLdd1GyoQurru+PtS/qa51X6VnZfEudDSmkc/mnHuhUcIW9P8VN8/wBCqltt8t8tnB0psHBv4s1ptPnP592J1Nv08lg2b9Lhqic5Q0/tHjacPKd1kJuX8ox4/qYtcelc3qqSbt9G6cop+CfblwQiBKrsjRV/44+rSc+Se9N629K7vTTknc6M05WS8Uu3HkyrCelx1JGajqHaLHzh5ztchPtP8JR4K9wLbI0Vv+OPqe/yeK1vSfpVdksz2KGrNK5/CdruqTdONxT/AJQbfBsK21n0MdRtL6DXqaLyVzcd/qbmjC0uuX5t+zLn8SmI5TcWpRbTT5TXkRb7BwRPFhtNZ8p/Pu3jU26WjetS3K9FttFquhPJ7XapvdP16icqdKpJXVrJ+XD8Yr5ckL94uhjf/Z1V7+90xLOYijy/0hiua0FH3yivaj+KMU2w6pt9to7inPSO4GRVtTabsryo7i3kl5OM+eF8mibmyvpUNOZiVHCb2aYeJqz4pvJ49OpQfPc3Om/aivlyjnw7T0POJ95X6/nzZ34cnlKs2pTqUakqVanKE4PiUZLhp+5o+S5LcXpa6YurLT71bo+4xttkLmHapZnByguZP/5aa7pfHlJldHUN0Z7udPtzUvcpjXmNO9pqll7GDlSS8lUXjB/MmaTauDVTwT8NvCWl8Nqc+sNCAAtHEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH1CE6klCnCUpSfCSXLZlWntptztVzVPTugs7fuXh6qxqNP8AFrg1tatY32ncRG/oxMG9MP0Q9UWZip0to8xbRl4O6iqXP82ZHR9HX1U1oqS0NbQ58p39NP8A3I863TV65I+cN/d3nuRoBJC79Ht1UWkHN7fxrceVG8pzf9GY1c9GHU7aX9GwrbP57mvUjSjVjRTppt8cuXPcviK63TW6ZI+cHu7R3NQYfD5XUGTt8NhMfXvb67qKlQoUIOc6kn4JJFlHSj6OTEactrXcTf8Ao0rm+glcUMJKS9RbrxUq7/ea/h8F5mz+mbpR236TNF1Nydyr2wqalp23r77J3LXqbCPHLp0ufPy7Xi34ERur3r91Lu3c3mhNr7q4w2kYydKrcwk4XGQS7uW13wg/d4sp8urz7TvODR8qR1t/DvWlcMcWTr4JI9SfpD9B7R29bQOy9pZZvN2kXb+upRSsLHju4XZ7pte5dxWpuXu3uHu9namodwdT3eVupybhGpNqlSXuhDwivkYg2222+Wzgs9Hs7Boo+CN9vGerjky2ydQAE9zAAAAAAAAAAAAAGbbXbzbk7NZyGe291Rd4ytGSdSlGbdGsvdOm+6S/qWX9OHpBNud7ralt9u/YWWEzl5D1EvpCUrC/b7ml2u6Lf8MvwKmjmMpRkpRbTT5TXimQNZs7DrY+ON1vGOrpjy2x9Fk3Vf6OCxyNC73D6f6MKdZqVxcYFS5p1V4uVu/J/wCX+RXDksZkMPf18XlbKtaXdtN061CtBxnCSfDTT8CZ/R/6QTP7ZV7PQG715cZbS0nGjb5Cbc7jHrwXL8Z01/NEoeqjpA0H1P6UjudtZcWFHVFW3VxbXls16jJw45UajXd2vdL+ZW4dZn2bkjBredZ6W/l2tjrljix9fBUMDtNTaZzujc9e6Z1NjK+PyWPqyo3FvWi4yhJP/b4nVnoImJjfCKAAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3js50Z7871Ro32ndJVbHE1eGslkf2FBxfnHnvl+BNLbD0UmgMTClebp6yvs3ccJztcevo9FP/W+ZNfgTF2gSW02iuF/+u438tTMuPD6vbeqy2mtJ4Y8v5WFNPSI3zzau0L0w7C7c0adPS+2OEpVKa49fXt1XqSfvbnz3/Lg2ZbWttZ0Y29pb0qFKPdGFOCjFfJI/UFPfJfJO+8zPq7xER0AAaMgAAr09LNX1zaYfRzs8vcU9LXdStRu7Sm2oVLpe1Bz48fZT4TK1C67r021/xJ6btR0be39bfYSMcta8LmXNJ8yivnHlFKJ7jYOWMmk4Y61mf5V+pjdfeAAu0cAAAAAAAAAAAAAAAAAAAlR0YdZ2c2CztDSerbqvfaHv6qjVpSk5SsJN/wDNp/5ffEiuDjqNPj1OOceSN8S2raaTvhbx1g9K+lep3QdLdPbGVpU1PRtFc2lzbtdjJ0OOVTk14y48H+BUhkcdfYi/uMXk7WpbXdrUlRrUakXGUJxfDTT8GTT9Hx1f19t89b7PbgZKUtM5WqoY24rS5VhcSfdHl+FOT/kzY3pIelCjdWtTqA29xq7cUnn7ehHunF+Fykv7v5lJo82TZ2f+izzvrPZn/DvkrGWvvK9e9W6AD0KMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD0EbQ/ZNor7u438tTMuMR2h+ybRX3dxv5amZcfL8vbn1W8dAAGjIAAAAA/ky2NtszirzEXkFKhe0KlvUTXPMZxcX/uUCbwaHudt90NT6HuqTpyxGSrUIRa/wDx9rmH9riegYqb9KRtr+rG9OP13aW/YtdU2CdWUV3fSKT7Mufi00/wPQez2fgzzin9UfWEbVV314vBC0AHs0AAAAAAAAAAAAAAAAAAAAAAcxlKElOEnGUXymnw0y2roD6i7LfbbK62k3ArU7zO4S1drUjXabv7GS7Kk0/Fpey/5lShneyG6+b2V3Nwm4WEqyU8dcR+kUk+6tbt8VIP38r+qRX7S0ca3DNY7Uc49XTFk93beznrD6frvp93dvsFbUqjwOTbvsRWa7nRk++HPvi+40WXG9Xe2eD6pemijrbSEad3kcfZrOYitDvlOn2OalLn4x5/GJTpOEqc5U5xcZRbTT8UzTZWsnVYPj7VeUs5qcFuXSXyACzcgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHoI2h+ybRX3dxv5amZcYjtD9k2ivu7jfy1My4+X5e3Pqt46AANGQAAAAAIkekv21/XXp8q6ltbft3mk7uF/Fpd6oy9mp+CT5JbnQa+0tZ630VnNI39KNShl7CtaSjLwfai0v68EjS5p0+euWO6Wt68VZh56AdrqrT95pTU2V0zfwlG4xd5WtKikuHzCbjz+PHJ1R9KiYmN8KkABkAAAAAAAAAAAAAAAAAAAAAFoHotN6P1j0XmNl85cetr4J/S8fGo+e1a1HxKHf4qMue73Mhv1r7Pf4Nb+57DWds6WKyk/0nju72fVVXy4r/TLlHV9Iu6FXaXf/AErqZ15U7Ovdxx98k+FKhWai+fk3F/gTj9KptnSz+22nt1cdRU62DuvodxUiuXK3rLmL+Skm/wATz8/+DtPl2ckfX8+6T/cw+cKuAAegRgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHoI2h+ybRX3dxv5amZcYjtD9k2ivu7jfy1My4+X5e3Pqt46AANGQAAAAAAAFNnpGdtf1C6jcllba39XZaooQydJpcRdR+zUS+TS/mRcLUPSrba/p3a3B7j2lv2rjTt99HuJpcv1FbuX4KXDKrz6BsjP/UaSkz1jl8lZnrw3kABZuQAAAAAAAAAAAAAAAAAAAAA+qdSdGpGrSm4zhJSjJPvTXgy5xVKHUd0LSqV1Gtc5PS3bkl3uNzQhzwvjzDj8SmEtp9F3qeGpOnnIaWup+tWEyte3lCXf7FZdvj5cSKLbtZjDTPHWswkaed9pr4qmKtOdGpOjUi4zhJxkn5NeKPkzLeXTU9H7r6t0zUXDx+XuaXHuXrG1/uYaXdLResWjvR5jdyAAbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9BG0P2TaK+7uN/LUzLjEdofsm0V93cb+WpmXHy/L259VvHQABoyAAAAAAAAwDfvQNvuds9qzRNempPI4ytGl3cuNVRcoNfHlFB17Z3GPvK9hd03Tr21WVGrB+MZxbTX80ei9pNcMo/wCtjbZ7YdRuqsRRoeqssjX/AEpaLju9XW9p/wB3aPT+zmfda+Ce/nH+UTVV5RZooAHrEIAAAAAAAAAAAAAAAAAAAAACxr0Ruam57gad7XsQVre8c+b5h/8AUrlJ4+iVuZU9zNa2yk0q2It217+zVl//AErNsV4tFf8Ab7w64J3ZIaL67cNDC9UuuKcI9lXd4rxr41IpmgiUnpKLdW/VZnezHhVMdYVPm3RRFskaG3Fpcc+UfZrkjdeQAEtoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPQRtD9k2ivu7jfy1My4xHaH7JtFfd3G/lqZlx8vy9ufVbx0AAaMgAAAAAAABXX6WXbX1lppLdWzt++lOpibyUV5P2qcpfiuF8yxQ0v1h7bLdLp51bp2lQ9bd0LR39muOX66j7a/2ZO2bn/p9VS/dv3T6Tyc8teOkwoxBy002mmmu5pnB9FVYAAAAAAAAAAAAAAAAAAAAAE8vRKW0qm5etrlR5jRxFum/d2qsv8A+EDSxz0RuEnGOv8AUfZ9mbtbHnjzXM//ALFXtm3Dor/t94dcH9yGhvST3MbnqszrjJP1ePsKb+DVFEXDffXTmoZrqk1zUhLtK0vVZ8/9uKRoQk6GvDpcceUfZrk53kABLaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD0EbQ/ZNor7u438tTMuMR2h+ybRX3dxv5amZcfL8vbn1W8dAAGjIAAAAAAAAfnc29G7t6trcQU6VaEqc4vwcWuGv5H6AChPqP29rbXb3au0bOk4UrTJValv3cJ0aj7cGvhxLj8DWpPP0rm2v6J1/pzc60t+KObtHYXU0u711Lvj/a2QMPo+gz/wBTpqZPL6qrJXgvMAAJjQAAAAAAAAAAAAAAAAAAAts9GBpmGmOnS91Tdw9Ss1lLi6nKXd+zpLsKXy4iVLUaNW4rQoUYOdSpJQhFeMpN8JIubyCodOHQvO3qSjSuMZpZUOV3OdzXh2e7/NzPn8Ci27abYqYK9bWj8+yRpo3Wm09ypDd/UdTV+6Wq9S1ZdqWQy1zW5969Y0v6IxA+pznUnKpUk5Sm3KTfm2fJd0rFKxWO5Hmd/MABsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD0EbQ/ZNor7u438tTMuMR2h+ybRX3dxv5amZcfL8vbn1W8dAAGjIAAAAAAAAAAI0+kI21/xD6bs3cW1v6y+05KGWoNLmXZg/bS+cWUvnom1BhrXUWCyGBvoRnb5G1q21RNcrszi4v/AHPP/ubo662/3B1Dou8pSp1MPka1r2ZePZjJ9l/jHhnrvZzPxY74Z7ufzQtVXdMWYyAD0qIAAAAAAAAAAAAAAAAAADdfR1tbV3a6gtLafnbupY2dyslfPjujRotS7/nLsomt6Vjc2nhdAac2nx9aMKuZufp91Ti+HGhS9mC+Tk3/ACP39F1sytJ7f5bebPUFRudQv1FlKouOxZ0+9z7/AAUpcvn3IhP1l7wPejfrUGobW4dTF2FX9G45c93qaT7PaXzabPP/APvbT5dnHH1/Psk/28PnLR4APQIwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD0EbQ/ZNor7u438tTMuMR2h+ybRX3dxv5amZcfL8vbn1W8dAAGjIAAAAAAAAAABUb6TzbX9Ud+KOsLS37FpqyxjcNpdzr0/Znz8X3fyLciHXpPttf1u2Io6xtLft3elL6NxJpd/qKnsz5fuXcy12Nn9xq67+k8vn/APXHPXipKo4AHvlaAAAAAAAAAAAAAAAAGw9hNoczvhulhdv8RSn2byup3lZLuoW0XzUm35d3cvi0a+p06lWpGlShKc5tRjGK5bb8EkW59CfT1junfai83R3Bp0rLPZm1+m3dStwnY2UY9qNNt+D4738XwV20tbGjwzaO1PKPV1xY/eW3dzsus7dTC9M3ThQ0Fo+VO0yWVtFhMXRp8KVKgocVavH+nu+cinmUpTk5Sbbb5bfmzdPVtv8AX3UHu5kNTxqVI4Wybs8RQb7oW8X9bj3yfe/maVNdlaOdJg+PtW5yZr8duXQABZuQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD0EbQ/ZNor7u438tTMuMR2h+ybRX3dxv5amZcfL8vbn1W8dAAGjIAAAAAAAAAABi+5+jrTcHbzUWi72kqlLMY6ta9l/xSi+z/AF4MoBmtprMWjuJjfyedjP4a707nMhgb6DjcY66q2tVNce1CTi/9j+Akr6QbbX/DzqRzle2t/V2OoowytvwuI8zXE0vk1/UjUfTNPljPirljvjeqbV4ZmAAHZqAAAAAAAAAAAAS46KOinMb45i213rqzrWWiLKqppTTjPJTT+pD/ACe+Xn4HDUajHpcc5Mk7ohtWs3ndDNPR5dH1bW2Ytt69xcXKOBx1RTw9pWhwrysn3VWn4wi/D3syf0kPVlSuvW7A7e5JOjTa/T91Ql3Nrwtk15L97+RtnrS6tdPdPOjo7R7WStaeqK9qraELdLsYm344T4XhPjwXl4lTN5eXWQu61/fXFSvcXE5VKtWpLmU5N8tt+b5KXRYMm0M39bqI+GOzH+XfJaMVfd1/d+IAPQowAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPQRtD9k2ivu7jfy1My4xHaH7JtFfd3G/lqZlx8vy9ufVbx0AAaMgAAAAAAAAAAAACBfpXdtf0roLTe51pb81sJduwuppeFGr9X+9FXpfX1I7e0d0dkdXaNnTUqt3jatS3bXLjWgu1Fr48r+pQxcUK1rXqWtxTcKtGbpzi/GMk+Gv5ntfZ/P7zTTjnrWfpP5KBqa7r7/F+YAL5GAAAAAAAAD6p06lWpGlShKc5tRjGK5bb8EkbA2i2E3S3wzMMRt/pe5vY9pKteTi4W1BebnUfd+C5ZZl09dCW0/Txjo7g7pZGxzOdsqfrql3euMLKxaXLcIy7m1/E+/wBxX63aWHRxutO+3hHV1x4rZOnRHjo+9Hnl9a1rLcXeuxq4/Axca1ph6ica94vFOovGEPh4s391a9aWjunnT0trNooWNbVFOh9GhC2ivo+Jhxwm0u5z90fLzNT9WXpIfpNK8292AuJUqXfQutQccNrwcbdeS/zfyK8ry9u8jd1r+/uatxcV5upVq1ZOUpyfe22/Fldg0WfaGSNRreVY6V/l0tkrijhx/N/Vns9mNT5i7z+fyFa+yF9VlWuLitNynObfLbbOvAPQRERG6EYABkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6CNofsm0V93cb+WpmXGI7Q/ZNor7u438tTMuPl+Xtz6reOgADRkAAAAAAAAAAAAAcSjGUXGSTTXDT80UY9YO28treobV2nadB07SvePIWndxzRre2n/ADci88jt1JdE23HUnnLXVGezGTxGWtbb6Kriy7DVSCfK7UZJp8FtsjXU0WaZydmYcc+OcleXVSkCxrNeiNm5v9Xd31CPl9Nx/af9jRi1x6JXcynJq33QwFZLwbs6sef7j1VdsaK36/pP8IU4MkdyBwJ423olNy6kkrndHAUYvxas6suP7jK8J6I1Rmv1j3fc4+f0Gw7L/vbMW2zoq/r+k/wzGDJPcrjPulRq3FSNGhSnUqTfEYQi22/cki2jTXov+nTTVNXWqsrm81Gl7Up3V4reH49jhcGZQvuhfput3K3raJxlxSXDdLsXdzNrybj2nz8+CNbbuK08OClrT6fn2bRp7R2p3KzdrejrqC3aq0p6f0FeWdjUa5vslF21GK9/te0/wRNzZn0XOgNJ+qz28uo5ahuKK9ZOxofsLOHHf7bftSS8+Xwfluf6VfQGEhUx20+i7vM1oJxp3V9/w9un8IL2mvxRC7eHrM373oVWz1Dq+tYYuo3xjsb/AMPR490uz3y+bZpP/U9dy5Y6/X8+TP8A2cfnKxbdTrO6cOmbCy0doG1sMrkrSHq6OKwkYRoUpJd3rKq7v5csrj3+6t93OoO+nDU+YlY4WMm6GIspOFvBeXa85v4s0rKUpycpSbbfLbfezgm6PZWDSTx9q3jLnfNa/LuAAWbkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9BG0P2TaK+7uN/LUzLjEdofsm0V93cb+WpmXHy/L259VvHQABoyAAAAAAAAAAAcNpJtvhLxZhu528G3Oz2Cqag3B1RZ4q3hFuFOpNOtWfuhBd8mVndTvpHNabnwutIbUQuNNacqc06t32uLy7h81/wAuL9y7/iT9Fs7PrZ+CN0eM9HPJlrj6pOdXXX9pjaK3u9D7X3VtmtXyi6VW4g1O3x78G213Smvd4LzK0qHUDvXa5y71HZ7m6gt7++rSr1qtO9mu1Nvl93PC+RgNWrUrVJVa1SU5zblKUny2/e2fB7TR7NwaPHwRG+Z6zPegZMtsk72/cN129UuFhGFPdTIXaj/1kY1n/VGT2/pKOqy3Sj+teJqJf/JiKMm/6EWwdbaHS2644+UNfeXjvSjufST9VlzFxerMTT586eIoxa/oYvmeunqlzUJQqbrZK0UvH6Go0f8AZGhAK6HS16Y4+UE5Lz3sv1Ju/ulq+o6mpdwM9kJPx9dfVGn+CfBiU5zqTdSpOU5SfLlJ8tnyCTWlaRurG5pMzPUABsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5lFwk4yXDT4ZwAAAAAAAAAAAAAAAABZv08ek024o6bwmh90sBdYGpi7K3x9PI2vNe3nGlTjCMpR+tHujy/EmpojdXbjciyp3+htaYnM06ke0o21zF1EvjB+0vxR59D+/D57N6fuoX2Dy15j7iDUo1LatKnJNfFMoNV7P4c0zbFPDPzhJpqbV5TzeicFKGg+vfqb0HGnb0NfVcvbU+F6nK0o3Ps+5Sl3o3vpb0tetbaMKesNsMTeqP1qllcTpTl+EuV/QpsuwNXTs7rfv8Ay7xqaT1WcAglh/Sz7W3UV+mdt8/Yy8/V3FOsv9kZHQ9Kf07zSdfFappt+KVlGXH9xEnZWsr1xy399j8UygQvu/Sp7A0ot2mB1PXl5J20If8A2ZiOd9LdoujGUNPbUZW5n+7Uub6EI/jFR5/qZrsnW26Y5JzY470/jhtJNt8JFVOr/St7yZWM6Ok9I4DBxaahVlGdxUXzU32f6EfdwOrLqD3MVSjqjczLStqnPNra1fo9H/8AzDgm4vZ7U3/uTFfq5zqaR0XB7n9Uexe0VCpLWG4GOjdU0+LK0qK4uJNeXYhzw/m0Qi3r9Knn8pC4w2ymmY4qjLmCymRSqV2v4oU/qx/HlkAK9evdVZV7mtUq1JvmU5ycpN/Fs/MutNsHTYPiyfFPn0+ThfU3t05Mh1tuBrTcbM1dQa31Jf5i/rPmVW6rOfHwSfcl8jHgC5rWKxurG6EfqAA2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADmMXOSjFctvhAdjqWwli9R5XGTXErO9r0H84VHH/ANHWmxuo/APTG/24mE9W4Qt9TZGVKLXhSnXnOn/ZKJrk54rcdK2jviGZjdO4AB0YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7PTFhLK6lxOLguZXl9QoL5zqRj/wCzrDY/TdgHqff/AG7wnq+3CvqXHyqx455pQrwnU/sjI55bcFLW8IlmI3zubb9JDo+emOqDLZRUuxR1NjbLK0+F3Nqn9Hn+Lnbyb+fxIulk3pXtvpXemdF7oWtBuWNu62FvJpctwrR9bRb9yjKlVXzqIrZIOyc3vtHSfCN3y5OmavDkkABZOQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEo/Ru6PnqbqgxWVdLt0dM429ytTldybp/R4fj2riLX+n4EXCyf0UO3zs9La03QuqLUsleUcLZykuGqdGPrarXvUpVaa+dNlbtbN7nR3nxjd8+TrhrxXhKzqV2u/xj2O1doCjRjUvr6wlWxyfleUWqtDv8uZwjFv3SZRdUhOlOVKrCUJwbjKMlw014po9DxTj187LS2i38yd9jrR0sFrDtZvHtR4hCpOX/ABNJeXs1eZJLwjUgUvs7quG1tPbv5x/n88kjVU5RZG0AHrEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfVOnUq1I0qUJTnNqMYxXLk34JLzZel017XrZzY7SOgKtGNO9sbCNbIJf9ZWbq1+/wA+Kk5RT90UVe9Auy0t3d/MZf5G0dTBaO7Obv248wnUhL/hqT8vaqpSafjGnMuOPJ+0Wp4rV09e7nP+PzzTdLTlNgj/ANbewUt+tlr2zw9oqup9OOWVwvEfbqzjH9rbr/uw7kvDtxpt+BIAHncGa2nyRlp1hKtWLRul54JRlCThOLjKL4aa4aZwTI9Ir0zT2z1093dI47s6X1ZcOV7ClH2LDJS5lNceUKvDnH/N6xdy7KcNz6NpdTTV4oy06T+blVes0twyAAkNQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5jGU5KEIuUpPhJLltnBMj0dXTNU3M11Hd7V2OctLaTuFKyhVj7F9ko8SguPOFLlTl/m9Wu9dpKPqtRTSYpy36R+bm1KTeeGE2eibYJ7C7LWVjmLRUtTaiccrmuV7dKco/srd/8AahwmvDtyqNeJv8A+c5s1tRknLfrK1rWKxugAByZY/r/QmmdzdHZXQmscfG9xGZt3b3FJ9zS8Yzi/3ZxklKMvKUU/IpQ6itg9VdO+415orUEJ17KbdfEZJQ7NO/tG/ZmvJTX1Zx/dkvNNN3nmsuoPYLRvURoC40Xqqn6i4pt18XkqcFKtYXPHCnHn60X4ShylJe5pSVtsraU6HJut2J6+Xm45sXvI5dVFgM13f2g1vshre90JrvGStr22fao1opuheUG2o16M2vahLj5ppppNNLCj3dL1yVi1Z3xKumJid0gANmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADNdododb73a3stCaDxkrq9uX261aXKoWlBNKdatPj2YR5+bbSSbaT1veuOs2tO6IZiJmd0O86ddg9VdRG41porT8J0LKm418vknDmnYWqftTfk5v6sI/vS9yUmrsNA6E0ztno7FaE0djo2WIw9vG3tqS7214ynJ/vTlJuUpecpN+ZiPT3sDo3p30Db6M0rT9fc1Gq+UydSCjWv7njhzl/DFeEIc8RXvblJ7NPCbV2lOuybq9iOnn5rHDi93HPqAAqXYAAAAAay396fNAdRGjZaV1paOncUO1UxuUoRX0mwrNfWg34xfC7UH3SSXg1GSp9386dNxunfVUtP61xrqWNecv0bl6EG7W/przhL92aXHapv2o/FNSd550Gu9A6O3N0xd6O13gLXMYi+jxVtriPcmvCcZLiUJrxUotST8GW2zdq5NDPDPOnh4ejjlwxk597z/AmT1M+jq11tnUvNXbQwutV6WhzVnZKPbyVjDxfMIr9vBfxQXa48Y8JycN5RlCThOLjKL4aa4aZ7XT6rFq6ceKd8fnVX2pak7rOAASGoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5jGU5KEIuUpPhJLltkx+mb0dWu9zalpq3d2F3pPS8nGrCylDsZK/h7lCS/YQf8U12vdHhqSj6jVYtJTjyzuj86Nq0ted1Wh9g+nXcfqI1THT+icb2LK3lF5LLXEWrSxpvznL96bXPZpx9qXwSbVwWwPT3oDp20dHS2jLN1Lq47NTJ5SvFfSb+sl9abX1Yrl9mC7opvxblJ5doTQGjdstM2uj9B6etMNiLNfs7e3hwnLznOT9qc3x3yk3J+bZkB4raW1cmunhjlTw8fVYYsMY+feAAqXYAAAAAAAAAAA0Bv70TbLb9OvmL7Fy07qaom/wBNYqEYVKs/fXp8dit5ct8T4XCmjf4OuHNkwW48U7pYtWLRulTjvR0Cb+7STrX+PwT1lg4NuN/g6cqtWEPJ1bbj1sHx3txU4r+IjhVpVaFWdGtTlTqU5OM4SXEoyXc00/BnodNabo9NmyG8iqVdwNu8Xf3s49n9IUoO3vF7v29Jxm+PdJtfA9FpfaK1fh1Fd/nH8f6Rb6WP0yoqBZRuF6KHSt527ra7c3I42ffKNpmreF1Tb9yq0uxKKXxhNketYejd6oNMTm8Vp/D6mow7/W4rKU4vj/Rceqk38EmXWHa2jzdLxHry+6PbDkr3IuA2Pn+m/f8A0w5/pvZnWVCEPrVY4avVpL/yQi4/1MLv9Makxcuxk9PZOzkvKvaVKb/uSJ1ctL9m0T+7nMTHV1gOZRlB9mcXFrya4ODowAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcxjKb7MIuTfklyBwDs7DTGpMpLsYzT2TvJPyoWlSo/7UzNMB03b/wCp3H9CbM6yrwn9WrLDV6VJ/wDknFR/qc7ZaU52tEfuzETPRrgEo9H+jd6oNTzg8rp/D6Zoz4frcrlKcml/ot/WyT+DS/AkHt96KHTFnOnd7obn3+Sa4crPC2sbWCfudar25ST+EIP4kHNtbR4et4n05/Z0rhvbuVtwhOrONKlCU5zajGMVy234JIkfst0Db+7uzt8hf4J6PwNXiTyObhKlUlD30rb/AJs3x3ptRg/4i0Ha7po2N2bcLjQG3WLsb6C4WQrRdzefHitVcpx581FpfA2cUuq9orW+HT13ec/x/tIppY/VKP2wXRJsvsM7fMWmMeo9T0Un+mspCM50p++hS+pR+DXM+Hw5skCAedzZ8motx5Z3ylVrFY3QAA5MgAAAAD//2Q==';
  $('#brandMark').src = LOGO;

  /* ==========================================================
     Seed data — illustrative figures for the static demo
     ========================================================== */

  var DATA = {
    score: 93,
    rings: [
      { pct: 72, label: 'Independent', color: 'var(--green)' },
      { pct: 28, label: 'AI-assisted', color: 'var(--amber)' },
      { pct: 29, label: 'On track',    color: 'var(--amber)' }
    ],
    week: [
      { d: 'M', v: 46, c: 'var(--green)' }, { d: 'T', v: 88, c: 'var(--amber)' },
      { d: 'W', v: 30, c: 'var(--green)' }, { d: 'T', v: 0,  c: 'var(--green)' },
      { d: 'F', v: 0,  c: 'var(--green)' }, { d: 'S', v: 0,  c: 'var(--green)' },
      { d: 'S', v: 0,  c: 'var(--green)' }
    ],
    chart: [
      { day: 'Jul 23', wrote: 310, pasted: 150 }, { day: 'Jul 24', wrote: 300, pasted: 110 },
      { day: 'Jul 25', wrote: 340, pasted: 170 }, { day: 'Jul 26', wrote: 350, pasted: 130 },
      { day: 'Jul 27', wrote: 360, pasted: 70  }, { day: 'Jul 28', wrote: 380, pasted: 160 },
      { day: 'Jul 29', wrote: 390, pasted: 140 }, { day: 'Jul 30', wrote: 890, pasted: 120 },
      { day: 'Jul 31', wrote: 430, pasted: 130 }, { day: 'Aug 1',  wrote: 900, pasted: 190 },
      { day: 'Aug 2',  wrote: 480, pasted: 55  }, { day: 'Aug 3',  wrote: 740, pasted: 150 },
      { day: 'Aug 4',  wrote: 500, pasted: 330 }, { day: 'Aug 5',  wrote: 500, pasted: 110 }
    ],
    sessions: [
      { site: 'docs.google.com', cat: 'Writing',     ago: '3d ago', mins: 22, score: 93,  tone: 'muted' },
      { site: 'docs.google.com', cat: 'Assessment',  ago: '4d ago', mins: 9,  score: 0,   tone: 'risk'  },
      { site: 'chatgpt.com',     cat: 'AI assistant',ago: '4d ago', mins: 27, score: null,tone: 'amber' },
      { site: 'docs.google.com', cat: 'Writing',     ago: '4d ago', mins: 22, score: 93,  tone: 'muted' },
      { site: 'github.com',      cat: 'Writing',     ago: '5d ago', mins: 17, score: 100, tone: 'muted' },
      { site: 'docs.google.com', cat: 'Writing',     ago: '6d ago', mins: 33, score: 86,  tone: 'muted' },
      { site: 'chatgpt.com',     cat: 'AI assistant',ago: '6d ago', mins: 12, score: null,tone: 'amber' }
    ],
    graded: [
      { site: 'docs.google.com', when: '2026-08-04', detail: '3 AI-linked pastes, 5 tab switches', score: 0 },
      { site: 'forms.gle',       when: '2026-08-01', detail: '1 AI-linked paste, 2 tab switches',  score: 42 }
    ]
  };

  /* ==========================================================
     Theme
     ========================================================== */

  var root = document.documentElement;
  var themeBtn = $('#themeToggle');

  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    themeBtn.setAttribute('aria-label',
      next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  });

  /* ==========================================================
     Navigation
     ========================================================== */

  var navToggle = $('#navToggle');
  var nav = $('#primaryNav');

  navToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  $$('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      $$('.nav-link').forEach(function (l) {
        l.classList.remove('is-active');
        l.removeAttribute('aria-current');
      });
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  var topbar = $('.topbar');
  window.addEventListener('scroll', function () {
    topbar.classList.toggle('is-stuck', window.scrollY > 8);
  }, { passive: true });

  $('#navAvatar').addEventListener('click', function () {
    $('#profileCard').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
  });

  /* ==========================================================
     Card tilt — cursor-tracked 3D, capped so it stays subtle
     ========================================================== */

  var MAX_TILT = 5;

  if (!REDUCED && window.matchMedia('(hover: hover)').matches) {
    $$('.card-tilt').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width  - 0.5;
        var py = (e.clientY - r.top)  / r.height - 0.5;
        card.style.setProperty('--ry', (px *  MAX_TILT).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (py * -MAX_TILT).toFixed(2) + 'deg');
      });
      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    });
  }

  /* ==========================================================
     Reveal on scroll
     ========================================================== */

  if (!REDUCED && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add('is-in'); }, Math.min(i, 3) * 60);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.06 });

    $$('.card').forEach(function (card) {
      card.classList.add('reveal');
      io.observe(card);
    });
  }

  /* ==========================================================
     Greeting
     ========================================================== */

  var h = new Date().getHours();
  $('#greeting').textContent =
    h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';

  /* ==========================================================
     Independence gauge
     ========================================================== */

  var GAUGE_R = 90, GAUGE_LEN = Math.PI * GAUGE_R;

  (function gauge() {
    var svg  = $('#gaugeSvg');
    var fill = $('#gaugeFill');
    var knob = $('#gaugeKnob');

    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML =
      '<linearGradient id="gaugeGrad" gradientUnits="userSpaceOnUse" x1="30" y1="0" x2="210" y2="0">' +
        '<stop offset="0%" stop-color="#D69A3B"/>' +
        '<stop offset="55%" stop-color="#8FAE55"/>' +
        '<stop offset="100%" stop-color="#4C9A6A"/>' +
      '</linearGradient>';
    svg.insertBefore(defs, svg.firstChild);

    fill.style.strokeDasharray = GAUGE_LEN;
    fill.style.strokeDashoffset = GAUGE_LEN;

    var v = DATA.score;
    var theta = Math.PI * (1 - v / 100);
    svg.setAttribute('aria-label', 'Independence score ' + v + ' out of 100');

    requestAnimationFrame(function () {
      fill.style.strokeDashoffset = GAUGE_LEN * (1 - v / 100);
      knob.setAttribute('cx', (120 + GAUGE_R * Math.cos(theta)).toFixed(1));
      knob.setAttribute('cy', (140 - GAUGE_R * Math.sin(theta)).toFixed(1));
    });

    countTo($('#scoreValue'), v, 1200);
  })();

  function countTo(el, target, ms) {
    if (REDUCED) { el.textContent = target; return; }
    var t0 = performance.now();
    (function step(now) {
      var p = Math.min((now - t0) / ms, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ==========================================================
     Hero rings
     ========================================================== */

  (function rings() {
    var C = 2 * Math.PI * 24;
    $('#ringRow').innerHTML = DATA.rings.map(function (r) {
      return '<li class="ring-item">' +
        '<svg viewBox="0 0 58 58" role="img" aria-label="' + r.pct + ' per cent ' + r.label + '">' +
          '<circle class="ring-bg" cx="29" cy="29" r="24"/>' +
          '<circle class="ring-fg" cx="29" cy="29" r="24" stroke="' + r.color + '" ' +
            'stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '" ' +
            'transform="rotate(-90 29 29)"/>' +
          '<text class="ring-pct" x="29" y="33" text-anchor="middle" ' +
            'style="color:' + r.color + '">' + r.pct + '%</text>' +
        '</svg>' +
        '<span class="ring-label">' + r.label + '</span>' +
      '</li>';
    }).join('');

    requestAnimationFrame(function () {
      $$('#ringRow .ring-fg').forEach(function (c, i) {
        c.style.strokeDashoffset = C * (1 - DATA.rings[i].pct / 100);
      });
    });
  })();

  /* ==========================================================
     Weekly bars
     ========================================================== */

  (function weekBars() {
    $('#weekBars').innerHTML = DATA.week.map(function (d) {
      return '<li class="week-bar" title="' + d.d + ' — ' + d.v + '% of your busiest day">' +
               '<span style="height:0;background:' + d.c + '"></span>' +
             '</li>';
    }).join('');

    requestAnimationFrame(function () {
      $$('#weekBars span').forEach(function (s, i) {
        s.style.height = DATA.week[i].v + '%';
      });
    });
  })();

  /* ==========================================================
     Composition chart
     ========================================================== */

  (function chart() {
    var peak = DATA.chart.reduce(function (m, d) {
      return Math.max(m, d.wrote + d.pasted);
    }, 0);

    $('#chart').innerHTML = DATA.chart.map(function (d) {
      var total = d.wrote + d.pasted;
      return '<div class="chart-col" title="' + d.day + '">' +
        '<span class="chart-tip">' + d.day + ' · ' + d.wrote + ' written / ' + d.pasted + ' pasted</span>' +
        '<div class="bar-pasted" style="height:0" data-h="' + (d.pasted / peak * 100) + '"></div>' +
        '<div class="bar-wrote"  style="height:0" data-h="' + (d.wrote  / peak * 100) + '"></div>' +
      '</div>';
    }).join('');

    var axis = document.createElement('p');
    axis.className = 'chart-axis';
    axis.innerHTML = '<span>' + DATA.chart[0].day + '</span>' +
                     '<span>' + DATA.chart[DATA.chart.length - 1].day + '</span>';
    $('#chart').insertAdjacentElement('afterend', axis);

    requestAnimationFrame(function () {
      $$('#chart [data-h]').forEach(function (bar) {
        bar.style.height = bar.getAttribute('data-h') + '%';
      });
    });
  })();

  /* ==========================================================
     Session list
     ========================================================== */

  (function sessions() {
    var dotColor = { risk: 'var(--risk)', amber: 'var(--amber)', muted: 'var(--muted)' };

    $('#sessionList').innerHTML = DATA.sessions.map(function (s) {
      var score = s.score === null
        ? '<span class="session-score" style="color:var(--muted)">—</span>'
        : '<span class="session-score">' + s.score + '</span>';
      return '<li class="session-item">' +
        '<span class="session-dot" style="background:' + dotColor[s.tone] + '"></span>' +
        '<span class="session-body">' +
          '<span class="session-site">' + s.site + '</span>' +
          '<span class="session-meta">' + s.cat + ' · ' + s.ago + '</span>' +
        '</span>' +
        '<span class="session-time">' + s.mins + 'm</span>' +
        score +
      '</li>';
    }).join('');
  })();

  /* ==========================================================
     Graded sessions (dark panel)
     ========================================================== */

  (function graded() {
    $('#gradedList').innerHTML = DATA.graded.map(function (g) {
      return '<li class="graded-item">' +
        '<svg class="graded-flag" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M5 21V4"/><path d="M5 5h11l-2 3 2 3H5"/></svg>' +
        '<span class="graded-body">' +
          '<span class="graded-site">' + g.site + '</span>' +
          '<span class="graded-meta">' + g.when + ' · <em>' + g.detail + '</em></span>' +
        '</span>' +
        '<span class="graded-score">' + g.score + '</span>' +
      '</li>';
    }).join('');
  })();

  /* ==========================================================
     Activity heatmap — 20 weeks, deterministic seed
     ========================================================== */

  (function heatmap() {
    var seed = 20260805;
    function rand() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    }

    var WEEKS = 20, html = '';
    for (var w = 0; w < WEEKS; w++) {
      html += '<div class="heat-week">';
      for (var d = 0; d < 7; d++) {
        var r = rand();
        var level = r < 0.34 ? 0 : r < 0.56 ? 1 : r < 0.78 ? 2 : r < 0.93 ? 3 : 4;
        var flagged = (w === 19 && d === 3);
        html += '<span class="heat-cell l' + level + (flagged ? ' is-flagged' : '') + '" ' +
                'title="' + (level === 0 ? 'No activity' : level * 25 + ' minutes tracked') +
                (flagged ? ' · flagged graded session' : '') + '"></span>';
      }
      html += '</div>';
    }
    $('#heatmap').innerHTML = html;
  })();

  /* ==========================================================
     Accordion
     ========================================================== */

  $$('.acc-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.parentElement;
      var open = item.classList.toggle('is-open');
      head.setAttribute('aria-expanded', String(open));
    });
  });

  /* ==========================================================
     Profile photo upload — click, keyboard and drag-and-drop.
     FileReader only; the image never leaves this browser.
     ========================================================== */

  (function uploader() {
    var MAX_BYTES = 2 * 1024 * 1024;
    var TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    var drop     = $('#dropzone');
    var input    = $('#fileInput');
    var preview  = $('#previewImg');
    var empty    = $('#uploaderEmpty');
    var errorBox = $('#uploadError');
    var changeBtn = $('#changeBtn');
    var removeBtn = $('#removeBtn');
    var navAvatar = $('#navAvatar');
    var navInitials = $('#navInitials');

    function fail(message) {
      errorBox.textContent = message;
      errorBox.hidden = false;
    }

    function clearError() {
      errorBox.hidden = true;
      errorBox.textContent = '';
    }

    function show(src) {
      preview.src = src;
      preview.hidden = false;
      empty.hidden = true;
      drop.classList.add('has-image');
      removeBtn.hidden = false;
      changeBtn.textContent = 'Change photo';

      navInitials.hidden = true;
      var img = navAvatar.querySelector('img') || new Image();
      img.src = src;
      img.alt = '';
      if (!img.parentNode) navAvatar.appendChild(img);
    }

    function reset() {
      if (preview.src.indexOf('blob:') === 0) URL.revokeObjectURL(preview.src);
      preview.removeAttribute('src');
      preview.hidden = true;
      empty.hidden = false;
      drop.classList.remove('has-image');
      removeBtn.hidden = true;
      changeBtn.textContent = 'Add photo';
      clearError();

      var img = navAvatar.querySelector('img');
      if (img) img.remove();
      navInitials.hidden = false;
    }

    function load(file) {
      if (!file) return;
      if (TYPES.indexOf(file.type) === -1) return fail('Choose a JPG, PNG or WebP image.');
      if (file.size > MAX_BYTES)          return fail('That image is over 2 MB. Pick a smaller one.');

      clearError();
      var reader = new FileReader();
      reader.onload = function (e) { show(e.target.result); };
      reader.onerror = function () { fail('That file could not be read. Try another image.'); };
      reader.readAsDataURL(file);
    }

    drop.addEventListener('click', function () { input.click(); });
    drop.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
    });

    changeBtn.addEventListener('click', function (e) { e.stopPropagation(); input.click(); });
    removeBtn.addEventListener('click', function (e) { e.stopPropagation(); reset(); });

    input.addEventListener('change', function () {
      load(input.files[0]);
      input.value = '';
    });

    ['dragenter', 'dragover'].forEach(function (name) {
      drop.addEventListener(name, function (e) {
        e.preventDefault();
        drop.classList.add('is-over');
      });
    });

    ['dragleave', 'dragend', 'drop'].forEach(function (name) {
      drop.addEventListener(name, function (e) {
        e.preventDefault();
        drop.classList.remove('is-over');
      });
    });

    drop.addEventListener('drop', function (e) {
      load(e.dataTransfer.files[0]);
    });
  })();

})();
