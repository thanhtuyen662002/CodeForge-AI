# Skill Graph

## Contract

Skill có id ổn định, slug, domain, tên tiếng Việt/Anh, mô tả năng lực quan sát được, version, status. Dependency là cạnh prerequisite → skill, loại hard/soft và reason. Graph không hard-code trong UI. Không cho chu kỳ, dangling references, self-edge hay duplicate IDs; validator chạy trước publish.

Taxonomy và graph version được pin vào path/blueprint/attempt. Đổi prerequisite không sửa lại interpretation lịch sử. Alias/mapping khi gộp skill phải có migration plan; không tái sử dụng id cũ cho khái niệm mới.

## Taxonomy v1 — khung mở rộng

| Domain | Nodes |
|---|---|
| Programming | variables, types, conditions, loops, functions, collections, OOP, algorithms, debugging |
| Python | syntax, list, dict, set, tuple, string, file-io, exceptions, modules, numpy, pandas, testing |
| SQL | select, where, join, group-by, having, subquery, cte, window, debugging, optimization |
| Data | cleaning, missing, duplicates, outliers, statistics, visualization, features |
| AI | foundations, classification, regression, train-test, overfitting, metrics, llm, embeddings, rag, prompting, tools, agents |
| Problem solving | logic, quantitative, patterns, decomposition, debugging, business-case |
| Software engineering | git, api, database, testing, cicd, architecture, security, debugging |

Mỗi bài có primary skill và optional secondary skills; điểm không được cộng nguyên trọng số cho tất cả skill cùng lúc. Mapping trọng số phải có tổng 1 và được review; slice chỉ sử dụng một primary skill để tránh độ chính xác giả.

## Slice taxonomy

logic.sequence → programming.variables → programming.conditions → python.conditions. programming.variables → sql.select → sql.filter. Đây là prerequisite sư phạm ban đầu, không phải chân lý học thuật. Cần kiểm chứng; cho phép học viên chọn đường thay thế có giải thích.

## Learner overlay

Không nhân bản toàn bộ graph cho từng người. Catalog dùng chung, learner có skill evidence/profile: evidence_count, unique_families, observed_score, sessions, delayed_check, coverage, updated_at, algorithm_version. Skill chưa quan sát có score=null; không thay bằng 0. Snapshot profile có thể tái dựng từ evidence ledger.

## Next-step policy

Nếu prerequisite chưa đủ bằng chứng, đề xuất bài cầu nối trước; nếu sai lặp lại, đổi cách giải thích/bài dễ hơn; nếu đã đủ evidence thì đề xuất transfer/delayed review. Luôn trả reason code và tối đa 2 lựa chọn thay thế. Không tạo chu trình học bế tắc khi lesson bị thu hồi; báo content gap cho author và chọn path fallback an toàn.
