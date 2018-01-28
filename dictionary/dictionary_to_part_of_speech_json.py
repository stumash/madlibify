from re import split

def main():
    with open("Oxford_English_Dictionary.txt", "r") as f:
        for line in f:
            process_line(line)



parts_of_speech = ["n.", "adv.", "adj.", "-v.", "v."]

def process_line(line):
    line = split(r"\s+", line)

    if (len(line) < 3): return

    part_of_speech = line[1]
    if (part_of_speech not in parts_of_speech): return

    print(line[0], len(line))


if __name__ == "__main__":
    main()
