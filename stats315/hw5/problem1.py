import math

total = 0

for x in range(2, 367):
    numerator = math.perm(365, x - 1) * (x - 1)
    denominator = 365 ** x

    p_x = numerator / denominator
    total += p_x

print(total)