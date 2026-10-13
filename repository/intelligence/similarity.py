from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def build_project_text(project):
    """
    Combines the important textual information from a repository
    project into one text document for overall similarity analysis.
    """

    title = project.title or ""
    keywords = project.keywords or ""
    abstract = project.abstract or ""

    return f"{title} {keywords} {abstract}"


def calculate_text_similarity(text1, text2):
    """
    Calculates the cosine similarity between two pieces of text.

    Returns the similarity as a percentage.
    """

    text1 = text1 or ""
    text2 = text2 or ""

    if not text1.strip() or not text2.strip():
        return 0

    vectorizer = TfidfVectorizer(
        stop_words="english"
    )

    try:

        tfidf_matrix = vectorizer.fit_transform(
            [text1, text2]
        )

        score = cosine_similarity(
            tfidf_matrix[0:1],
            tfidf_matrix[1:]
        )[0][0]

        return round(float(score) * 100, 2)

    except ValueError:

        return 0


def calculate_similarity(proposed_text, projects):
    """
    Compares a proposed project against existing repository projects.

    Returns projects ranked by overall similarity percentage.
    """

    projects = list(projects)

    if not projects:
        return []

    project_texts = [
        build_project_text(project)
        for project in projects
    ]

    all_texts = [proposed_text] + project_texts

    vectorizer = TfidfVectorizer(
        stop_words="english"
    )

    try:

        tfidf_matrix = vectorizer.fit_transform(
            all_texts
        )

    except ValueError:

        return []

    similarity_scores = cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:]
    )[0]

    results = []

    for project, score in zip(
        projects,
        similarity_scores
    ):

        similarity_percentage = round(
            float(score) * 100,
            2
        )

        results.append({
            "project": project,
            "similarity": similarity_percentage
        })

    results.sort(
        key=lambda x: x["similarity"],
        reverse=True
    )

    return results


def calculate_component_similarity(
    title,
    keywords,
    abstract,
    project
):
    """
    Calculates similarity between each component of a proposed
    project and the corresponding component of an existing project.
    """

    title_similarity = calculate_text_similarity(
        title,
        project.title
    )

    keywords_similarity = calculate_text_similarity(
        keywords,
        project.keywords
    )

    abstract_similarity = calculate_text_similarity(
        abstract,
        project.abstract
    )

    return {
        "title": title_similarity,
        "keywords": keywords_similarity,
        "abstract": abstract_similarity
    }


def calculate_weighted_similarity(component_scores):
    """
    Calculates the overall similarity score using weighted
    contributions from the project components.

    Weights:
        Title    = 35%
        Keywords = 20%
        Abstract = 45%
        Ca
    """

    title_score = component_scores.get("title", 0)
    keywords_score = component_scores.get("keywords", 0)
    abstract_score = component_scores.get("abstract", 0)

    weighted_score = (
        (title_score * 0.35) +
        (keywords_score * 0.20) +
        (abstract_score * 0.45)
    )

    return round(weighted_score, 2)


def assess_originality(similarity_results):
    """
    Provides an overall similarity assessment based on
    the highest repository similarity score.
    """

    if not similarity_results:

        return {
            "level": "No Data",
            "message": (
                "There are no approved projects available "
                "for comparison."
            ),
            "score": 0
        }

    highest_score = similarity_results[0]["similarity"]

    if highest_score >= 70:

        return {
            "level": "High Similarity",
            "message": (
                "The proposed project is highly similar to "
                "an existing project in the repository. "
                "The student should review and refine the "
                "project scope, methodology, or objectives."
            ),
            "score": highest_score
        }

    elif highest_score >= 40:

        return {
            "level": "Moderate Similarity",
            "message": (
                "The proposed project has noticeable similarity "
                "with existing projects in the repository. "
                "The student should examine the related projects "
                "and consider how the proposed work differs."
            ),
            "score": highest_score
        }

    else:

        return {
            "level": "Low Similarity",
            "message": (
                "The proposed project has relatively low similarity "
                "with the projects currently available in the repository."
            ),
            "score": highest_score
        }

def generate_similarity_explanation(component_scores):
    """
    Generates a human-readable explanation of the strongest
    similarity areas between a proposed project and an existing
    repository project.
    """

    if not component_scores:
        return {
            "primary_area": "None",
            "message": "No similarity information is available."
        }

    component_names = {
        "title": "Title",
        "keywords": "Keywords",
        "abstract": "Abstract"
    }

    sorted_components = sorted(
        component_scores.items(),
        key=lambda item: item[1],
        reverse=True
    )

    primary_component, primary_score = sorted_components[0]

    primary_name = component_names.get(
        primary_component,
        primary_component
    )

    if primary_score >= 70:

        message = (
            f"The strongest similarity was detected in the "
            f"{primary_name.lower()} component, with a similarity "
            f"score of {primary_score}%. The student should carefully "
            f"review this area and determine whether the proposed "
            f"project has sufficient differences in scope, objectives "
            f"or methodology."
        )

    elif primary_score >= 40:

        message = (
            f"The {primary_name.lower()} component shows noticeable "
            f"similarity, with a score of {primary_score}%. The student "
            f"should examine the corresponding existing project and "
            f"clearly distinguish the proposed work."
        )

    else:

        message = (
            f"The highest component similarity was found in the "
            f"{primary_name.lower()} component at {primary_score}%. "
            f"No individual component shows a high level of textual "
            f"similarity based on the current repository comparison."
        )

    return {
        "primary_area": primary_name,
        "primary_score": primary_score,
        "message": message
    }